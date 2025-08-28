;; Test suite for Micro-Pension Smart Contract
;; Run with: clarinet test

(use-trait contract-owner-trait
  .contract-owner-trait)

(define-constant contract-address 'ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT)
(define-constant contract-name 'pension)
(define-constant user-1 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
(define-constant user-2 'ST2CY5V39NHDPWSXMW3Q6C4NCFS2W56CCMA6AWKWD)
(define-constant user-3 'ST3AM1A963AKGJZ2Q9FJ2BFJ3T3K9F5Z4V62FZ6J)

;; Test data
(define-constant plan-1 u1)
(define-constant plan-2 u2)
(define-constant unlock-height u1000)
(define-constant contribution-amount u1000000) ; 1 STX in microSTX
(define-constant penalty-bps u500) ; 5%

;; Helper functions
(define-private (setup-test)
  (begin
    ;; Add test plans
    (contract-call? contract-address add-plan plan-1 u12 u6 penalty-bps true "Standard Plan")
    (contract-call? contract-address add-plan plan-2 u24 u12 u1000 false "Conservative Plan")
    (ok true)))

;; Test enrollment
(define-test (test-enrollment)
  (begin
    (setup-test)
    ;; Test successful enrollment
    (assert-eq! (contract-call? contract-address enroll plan-1 unlock-height user-2) (ok true))
    ;; Test double enrollment fails
    (assert-eq! (contract-call? contract-address enroll plan-1 unlock-height user-3) (err u101))
    ;; Test invalid plan fails
    (assert-eq! (contract-call? contract-address enroll u999 unlock-height user-3) (err u106))
    (ok true)))

;; Test contributions
(define-test (test-contributions)
  (begin
    (setup-test)
    ;; Enroll user first
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    ;; Test contribution
    (assert-eq! (contract-call? contract-address contribute) (ok contribution-amount))
    ;; Test balance update
    (let ((balance (contract-call? contract-address get-balance user-1)))
      (assert-eq! (get contributed balance) contribution-amount))
    (ok true)))

;; Test proof of life
(define-test (test-proof-of-life)
  (begin
    (setup-test)
    ;; Enroll and contribute
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    (contract-call? contract-address contribute)
    ;; Test proof of life
    (assert-eq! (contract-call? contract-address proof-of-life) (ok true))
    ;; Verify last ping updated
    (let ((balance (contract-call? contract-address get-balance user-1)))
      (assert! (> (get last-ping balance) u0)))
    (ok true)))

;; Test early exit
(define-test (test-early-exit)
  (begin
    (setup-test)
    ;; Enroll and contribute
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    (contract-call? contract-address contribute)
    ;; Test early exit
    (assert-eq! (contract-call? contract-address exit-early) (ok 950000)) ; 95% of 1 STX
    ;; Verify community pool increased
    (assert-eq! (contract-call? contract-address get-community-pool) (ok 50000)) ; 5% penalty
    (ok true)))

;; Test beneficiary claim
(define-test (test-beneficiary-claim)
  (begin
    (setup-test)
    ;; Enroll and contribute
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    (contract-call? contract-address contribute)
    ;; Test beneficiary claim (should fail before wait period)
    (assert-eq! (contract-call? contract-address claim-as-beneficiary user-1) (err u406))
    (ok true)))

;; Test regular claim
(define-test (test-claim)
  (begin
    (setup-test)
    ;; Enroll and contribute
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    (contract-call? contract-address contribute)
    ;; Test claim before unlock (should fail)
    (assert-eq! (contract-call? contract-address claim) (err u102))
    (ok true)))

;; Test admin functions
(define-test (test-admin-functions)
  (begin
    (setup-test)
    ;; Test setting beneficiary wait
    (assert-eq! (contract-call? contract-address set-beneficiary-wait u20000) (ok true))
    ;; Test setting pause
    (assert-eq! (contract-call? contract-address set-paused true) (ok true))
    ;; Test unpause
    (assert-eq! (contract-call? contract-address set-paused false) (ok true))
    (ok true)))

;; Test plan management
(define-test (test-plan-management)
  (begin
    (setup-test)
    ;; Test getting plan
    (let ((plan (contract-call? contract-address get-plan plan-1)))
      (assert-eq! (get name plan) "Standard Plan")
      (assert-eq! (get early-exit plan) true))
    (ok true)))

;; Test account queries
(define-test (test-account-queries)
  (begin
    (setup-test)
    ;; Enroll user
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    ;; Test getting account
    (let ((account (contract-call? contract-address get-account user-1)))
      (assert-eq! (get plan-id account) plan-1)
      (assert-eq! (get beneficiary account) user-2))
    ;; Test getting balance
    (let ((balance (contract-call? contract-address get-balance user-1)))
      (assert-eq! (get contributed balance) u0))
    (ok true)))

;; Test contribution for others
(define-test (test-contribute-for)
  (begin
    (setup-test)
    ;; Enroll user 2
    (contract-call? contract-address enroll plan-1 unlock-height user-3)
    ;; Contribute for user 2
    (assert-eq! (contract-call? contract-address contribute-for user-2) (ok contribution-amount))
    ;; Verify balance updated for user 2
    (let ((balance (contract-call? contract-address get-balance user-2)))
      (assert-eq! (get contributed balance) contribution-amount))
    (ok true)))

;; Test error conditions
(define-test (test-error-conditions)
  (begin
    (setup-test)
    ;; Test contribution without enrollment
    (assert-eq! (contract-call? contract-address contribute) (err u100))
    ;; Test proof of life without enrollment
    (assert-eq! (contract-call? contract-address proof-of-life) (err u100))
    ;; Test claim without enrollment
    (assert-eq! (contract-call? contract-address claim) (err u100))
    ;; Test early exit without enrollment
    (assert-eq! (contract-call? contract-address exit-early) (err u100))
    (ok true)))

;; Test community pool
(define-test (test-community-pool)
  (begin
    (setup-test)
    ;; Enroll and contribute
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    (contract-call? contract-address contribute)
    ;; Early exit to add to community pool
    (contract-call? contract-address exit-early)
    ;; Test community pool withdrawal (admin only)
    (assert-eq! (contract-call? contract-address withdraw-community-pool u25000 user-3) (ok true))
    ;; Verify pool decreased
    (assert-eq! (contract-call? contract-address get-community-pool) (ok u25000))
    (ok true)))

;; Test emergency functions
(define-test (test-emergency-functions)
  (begin
    (setup-test)
    ;; Test emergency pause
    (assert-eq! (contract-call? contract-address emergency-pause) (ok true))
    ;; Test emergency unpause
    (assert-eq! (contract-call? contract-address emergency-unpause) (ok true))
    (ok true)))

;; Test unlock status
(define-test (test-unlock-status)
  (begin
    (setup-test)
    ;; Enroll user
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    ;; Test unlock status (should be false before unlock height)
    (assert-eq! (contract-call? contract-address is-unlocked user-1) (ok false))
    (ok true)))

;; Test beneficiary wait
(define-test (test-beneficiary-wait)
  (begin
    (setup-test)
    ;; Test getting beneficiary wait
    (assert-eq! (contract-call? contract-address get-beneficiary-wait) (ok u10080))
    (ok true)))

;; Test plan validation
(define-test (test-plan-validation)
  (begin
    (setup-test)
    ;; Test valid plan
    (let ((plan (contract-call? contract-address get-plan plan-1)))
      (assert! (is-some plan)))
    ;; Test invalid plan
    (let ((plan (contract-call? contract-address get-plan u999)))
      (assert! (is-none plan)))
    (ok true)))

;; Test account state
(define-test (test-account-state)
  (begin
    (setup-test)
    ;; Test default account state
    (let ((account (contract-call? contract-address get-account user-3)))
      (assert-eq! (get plan-id account) u0)
      (assert-eq! (get start-bn account) u0))
    ;; Test default balance state
    (let ((balance (contract-call? contract-address get-balance user-3)))
      (assert-eq! (get contributed balance) u0)
      (assert-eq! (get claimable balance) u0))
    (ok true)))

;; Test contribution limits
(define-test (test-contribution-limits)
  (begin
    (setup-test)
    ;; Enroll user
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    ;; Test zero contribution (should fail)
    (assert-eq! (contract-call? contract-address contribute) (err u105))
    (ok true)))

;; Test plan parameters
(define-test (test-plan-parameters)
  (begin
    (setup-test)
    ;; Test plan 1 parameters
    (let ((plan (contract-call? contract-address get-plan plan-1)))
      (assert-eq! (get min-periods plan) u12)
      (assert-eq! (get cliff plan) u6)
      (assert-eq! (get penalty-bps plan) penalty-bps)
      (assert-eq! (get early-exit plan) true))
    ;; Test plan 2 parameters
    (let ((plan (contract-call? contract-address get-plan plan-2)))
      (assert-eq! (get early-exit plan) false))
    (ok true)))

;; Test beneficiary validation
(define-test (test-beneficiary-validation)
  (begin
    (setup-test)
    ;; Test enrollment with self as beneficiary (should fail)
    (assert-eq! (contract-call? contract-address enroll plan-1 unlock-height user-1) (err u107))
    (ok true)))

;; Test block height validation
(define-test (test-block-height-validation)
  (begin
    (setup-test)
    ;; Test enrollment with past unlock height (should fail)
    (assert-eq! (contract-call? contract-address enroll plan-1 u100 user-2) (err u403))
    (ok true)))

;; Test penalty calculation
(define-test (test-penalty-calculation)
  (begin
    (setup-test)
    ;; Enroll and contribute
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    (contract-call? contract-address contribute)
    ;; Calculate expected penalty and payout
    (let ((expected-penalty (/ (* penalty-bps contribution-amount) u10000))
          (expected-payout (- contribution-amount expected-penalty)))
      ;; Test early exit
      (assert-eq! (contract-call? contract-address exit-early) (ok expected-payout))
      ;; Verify community pool
      (assert-eq! (contract-call? contract-address get-community-pool) (ok expected-penalty)))
    (ok true)))

;; Test event emission
(define-test (test-event-emission)
  (begin
    (setup-test)
    ;; Enroll user (should emit event)
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    ;; Contribute (should emit event)
    (contract-call? contract-address contribute)
    ;; Proof of life (should emit event)
    (contract-call? contract-address proof-of-life)
    ;; Early exit (should emit event)
    (contract-call? contract-address exit-early)
    (ok true)))

;; Test comprehensive flow
(define-test (test-comprehensive-flow)
  (begin
    (setup-test)
    ;; 1. Enroll
    (contract-call? contract-address enroll plan-1 unlock-height user-2)
    ;; 2. Contribute
    (contract-call? contract-address contribute)
    ;; 3. Proof of life
    (contract-call? contract-address proof-of-life)
    ;; 4. Early exit
    (contract-call? contract-address exit-early)
    ;; 5. Verify final state
    (let ((balance (contract-call? contract-address get-balance user-1))
          (pool (contract-call? contract-address get-community-pool)))
      (assert-eq! (get claimable balance) u0)
      (assert! (> (get pool) u0)))
    (ok true)))
