;; Micro-Pension Smart Contract
;; A non-custodial micro-pension system on Stacks
;; Features: auto-contributions, time-locked withdrawals, beneficiary failover, community penalty pool

(define-constant ERR-NOT-ENROLLED u100)
(define-constant ERR-ALREADY-ENROLLED u101)
(define-constant ERR-NOT-UNLOCKED u102)
(define-constant ERR-NOT-BENEFICIARY u103)
(define-constant ERR-EARLY-EXIT-DISABLED u104)
(define-constant ERR-INVALID-AMOUNT u105)
(define-constant ERR-INVALID-PLAN u106)
(define-constant ERR-INVALID-BENEFICIARY u107)

;; Admin and configuration
(define-data-var admin principal tx-sender)
(define-data-var community-pool uint u0)
(define-data-var beneficiary-wait-default uint u10080) ; ~1 week in blocks (tune)
(define-data-var is-paused bool false)

;; Data structures
(define-map plans
  {id: uint}
  {min-periods: uint, cliff: uint, penalty-bps: uint, early-exit: bool, name: (string-ascii 50)})

(define-map accounts
  {user: principal}
  {plan-id: uint, start-bn: uint, unlock-bn: uint, beneficiary: principal, paused: bool})

(define-map balances
  {user: principal}
  {contributed: uint, claimable: uint, last-ping: uint})

;; Events
(define-map events
  {id: uint}
  {event-type: (string-ascii 20), user: principal, amount: uint, block: uint, data: (string-ascii 100)})

(define-data-var event-counter uint u0)

;; Helper functions
(define-private (emit-event (event-type (string-ascii 20)) (user principal) (amount uint) (data (string-ascii 100)))
  (let ((counter (+ (var-get event-counter) u1)))
    (begin
      (var-set event-counter counter)
      (map-set events {id: counter}
        {event-type: event-type, user: user, amount: amount, block: block-height, data: data})
      true)))

(define-private (is-valid-plan (plan-id uint))
  (is-some (map-get? plans {id: plan-id}))

(define-private (is-valid-beneficiary (beneficiary principal))
  (and (is-eq beneficiary tx-sender) false) ; Cannot be self
  )

;; Read-only functions
(define-read-only (get-account (user principal))
  (default-to {plan-id: u0, start-bn: u0, unlock-bn: u0, beneficiary: tx-sender, paused: false}
    (map-get? accounts {user: user})))

(define-read-only (get-balance (user principal))
  (default-to {contributed: u0, claimable: u0, last-ping: u0}
    (map-get? balances {user: user})))

(define-read-only (get-plan (plan-id uint))
  (map-get? plans {id: plan-id}))

(define-read-only (is-unlocked (user principal))
  (let ((acc (unwrap-panic (map-get? accounts {user: user}))))
    (ok (>= block-height (get unlock-bn acc)))))

(define-read-only (get-community-pool)
  (ok (var-get community-pool)))

(define-read-only (get-beneficiary-wait)
  (ok (var-get beneficiary-wait-default)))

;; Admin functions
(define-public (add-plan (id uint) (min-periods uint) (cliff uint) (penalty-bps uint) (early-exit bool) (name (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) u401)
    (asserts! (<= penalty-bps u1000) u402) ; Max 10% penalty
    (map-set plans {id: id} {min-periods: min-periods, cliff: cliff, penalty-bps: penalty-bps, early-exit: early-exit, name: name})
    (emit-event "plan-added" tx-sender u0 name)
    (ok true)))

(define-public (set-beneficiary-wait (wait uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) u401)
    (var-set beneficiary-wait-default wait)
    (ok true)))

(define-public (set-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) u401)
    (var-set is-paused paused)
    (ok true)))

;; Core pension functions
(define-public (enroll (plan-id uint) (unlock-bn uint) (beneficiary principal))
  (let
    ((maybe (map-get? accounts {user: tx-sender})))
    (if maybe (err ERR-ALREADY-ENROLLED)
      (begin
        (asserts! (is-valid-plan plan-id) ERR-INVALID-PLAN)
        (asserts! (is-valid-beneficiary beneficiary) ERR-INVALID-BENEFICIARY)
        (asserts! (> unlock-bn block-height) u403) ; Must be future
        (map-set accounts {user: tx-sender}
          {plan-id: plan-id, start-bn: block-height, unlock-bn: unlock-bn, beneficiary: beneficiary, paused: false})
        (map-set balances {user: tx-sender} {contributed: u0, claimable: u0, last-ping: block-height})
        (emit-event "enrolled" tx-sender u0 "enrolled")
        (ok true)))))

(define-private (credit (user principal) (amount uint))
  (let ((b (unwrap-panic (map-get? balances {user: user}))))
    (map-set balances {user: user}
      {contributed: (+ (get contributed b) amount),
       claimable: (+ (get claimable b) amount),
       last-ping: block-height})
    true))

;; STX contribution
(define-public (contribute)
  (let ((amt (stx-get-transfer-amount)))
    (asserts! (not (var-get is-paused)) u408)
    (asserts! (> amt u0) ERR-INVALID-AMOUNT)
    (asserts! (map-get? accounts {user: tx-sender}) ERR-NOT-ENROLLED)
    (try! (stx-transfer? amt tx-sender (as-contract tx-sender)))
    (begin 
      (credit tx-sender amt) 
      (emit-event "contributed" tx-sender amt "contribution")
      (ok amt))))

;; Contribute for another user (support dependents)
(define-public (contribute-for (user principal))
  (let ((amt (stx-get-transfer-amount)))
    (asserts! (not (var-get is-paused)) u408)
    (asserts! (> amt u0) ERR-INVALID-AMOUNT)
    (asserts! (map-get? accounts {user: user}) ERR-NOT-ENROLLED)
    (try! (stx-transfer? amt tx-sender (as-contract tx-sender)))
    (begin 
      (credit user amt) 
      (emit-event "contributed-for" tx-sender amt "contribution-for")
      (ok amt))))

(define-public (proof-of-life)
  (let ((b (unwrap! (map-get? balances {user: tx-sender}) (err ERR-NOT-ENROLLED))))
    (map-set balances {user: tx-sender}
      {contributed: (get contributed b), claimable: (get claimable b), last-ping: block-height})
    (emit-event "ping" tx-sender u0 "proof-of-life")
    (ok true)))

(define-public (claim)
  (let (
        (acc (unwrap! (map-get? accounts {user: tx-sender}) (err ERR-NOT-ENROLLED)))
        (bal (unwrap-panic (map-get? balances {user: tx-sender}))))
    (if (>= block-height (get unlock-bn acc))
        (let ((amt (get claimable bal)))
          (asserts! (> amt u0) u405)
          (map-set balances {user: tx-sender} {contributed: (get contributed bal), claimable: u0, last-ping: block-height})
          (try! (stx-transfer? amt (as-contract tx-sender) tx-sender))
          (emit-event "claimed" tx-sender amt "claim")
          (ok amt))
        (err ERR-NOT-UNLOCKED))))

(define-public (exit-early)
  (let (
        (acc (unwrap! (map-get? accounts {user: tx-sender}) (err ERR-NOT-ENROLLED)))
        (plan (unwrap-panic (map-get? plans {id: (get plan-id acc)})))
        (bal (unwrap-panic (map-get? balances {user: tx-sender}))))
    (if (get early-exit plan)
        (let ((amt (get claimable bal))
              (penalty (/ (* (get penalty-bps plan) (get claimable bal)) u10000))
              (payout (- (get claimable bal) penalty)))
          (asserts! (> amt u0) u405)
          (map-set balances {user: tx-sender} {contributed: (get contributed bal), claimable: u0, last-ping: block-height})
          (var-set community-pool (+ (var-get community-pool) penalty))
          (try! (stx-transfer? payout (as-contract tx-sender) tx-sender))
          (emit-event "early-exit" tx-sender payout "early-exit")
          (ok payout))
        (err ERR-EARLY-EXIT-DISABLED))))

(define-public (claim-as-beneficiary (owner principal))
  (let (
        (acc (unwrap! (map-get? accounts {user: owner}) (err ERR-NOT-ENROLLED)))
        (bal (unwrap-panic (map-get? balances {user: owner})))
        (wait (var-get beneficiary-wait-default)))
    (begin
      (asserts! (is-eq tx-sender (get beneficiary acc)) ERR-NOT-BENEFICIARY)
      (asserts! (>= (- block-height (get last-ping bal)) wait) u406)
      (asserts! (> (get claimable bal) u0) u405)
      (map-set balances {user: owner} {contributed: (get contributed bal), claimable: u0, last-ping: (get last-ping bal)})
      (try! (stx-transfer? (get claimable bal) (as-contract tx-sender) tx-sender))
      (emit-event "beneficiary-claim" tx-sender (get claimable bal) "beneficiary-claim")
      (ok true))))

;; Community pool management
(define-public (withdraw-community-pool (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) u401)
    (asserts! (<= amount (var-get community-pool)) u407)
    (var-set community-pool (- (var-get community-pool) amount))
    (try! (stx-transfer? amount (as-contract tx-sender) recipient))
    (emit-event "pool-withdraw" tx-sender amount "community-pool-withdraw")
    (ok true)))

;; Emergency pause (admin only)
(define-public (emergency-pause)
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) u401)
    (var-set is-paused true)
    (ok true)))

;; Emergency unpause (admin only)
(define-public (emergency-unpause)
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) u401)
    (var-set is-paused false)
    (ok true)))
