import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js"
import { expect } from "chai"
import Peerchain from "../target/types/peerchain"

describe("peerchain", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Peerchain as Program<Peerchain>
  const authority = provider.wallet.publicKey

  // Test keypairs
  const mentor = Keypair.generate()
  const student = Keypair.generate()

  // PDA derivations
  const [treasuryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    program.programId
  )

  const [authorProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-profile"), authority.toBuffer()],
    program.programId
  )

  const [mentorProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-profile"), mentor.publicKey.toBuffer()],
    program.programId
  )

  const [studentProfilePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-profile"), student.publicKey.toBuffer()],
    program.programId
  )

  const [reputationPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("reputation"), authority.toBuffer()],
    program.programId
  )

  const sessionId = Keypair.generate().publicKey
  const [sessionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("session"), sessionId.toBuffer()],
    program.programId
  )

  const requestId = Keypair.generate().publicKey
  const [fundingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("funding"), requestId.toBuffer()],
    program.programId
  )

  it("creates a user profile", async () => {
    await program.methods
      .createUser("Alice")
      .accounts({
        userProfile: authorProfilePda,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const profile = await program.account.userProfile.fetch(authorProfilePda)
    expect(profile.name).to.equal("Alice")
    expect(profile.reputation.toNumber()).to.equal(0)
    expect(profile.totalSessions.toNumber()).to.equal(0)
    expect(profile.role).to.equal(0) // Student
  })

  it("creates mentor and student profiles", async () => {
    // AirDrop SOL to mentor and student
    await provider.connection.requestAirdrop(mentor.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    await provider.connection.requestAirdrop(student.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)

    await program.methods
      .createUser("Mentor")
      .accounts({
        userProfile: mentorProfilePda,
        authority: mentor.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([mentor])
      .rpc()

    await program.methods
      .createUser("Student")
      .accounts({
        userProfile: studentProfilePda,
        authority: student.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([student])
      .rpc()

    const mentorProfile = await program.account.userProfile.fetch(mentorProfilePda)
    expect(mentorProfile.name).to.equal("Mentor")

    const studentProfile = await program.account.userProfile.fetch(studentProfilePda)
    expect(studentProfile.name).to.equal("Student")
  })

  it("initializes treasury", async () => {
    await program.methods
      .initializeTreasury()
      .accounts({
        treasury: treasuryPda,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const treasury = await program.account.treasuryPool.fetch(treasuryPda)
    expect(treasury.authority.equals(authority)).to.be.true
    expect(treasury.totalFunds.toNumber()).to.equal(0)
    expect(treasury.activeRequests.toNumber()).to.equal(0)
  })

  it("funds the treasury", async () => {
    const transferIx = SystemProgram.transfer({
      fromPubkey: authority,
      toPubkey: treasuryPda,
      lamports: 10 * anchor.web3.LAMPORTS_PER_SOL,
    })

    const tx = new anchor.web3.Transaction().add(transferIx)
    await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [provider.wallet.payer])

    const balance = await provider.connection.getBalance(treasuryPda)
    expect(balance).to.equal(10 * anchor.web3.LAMPORTS_PER_SOL)
  })

  it("logs a mentorship session", async () => {
    await program.methods
      .logSession(sessionId, new anchor.BN(60), { oneOnOne: {} }, "Learning Rust")
      .accounts({
        session: sessionPda,
        student: student.publicKey,
        mentor: mentor.publicKey,
        studentProfile: studentProfilePda,
        mentorProfile: mentorProfilePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([student, mentor])
      .rpc()

    const session = await program.account.mentorshipSession.fetch(sessionPda)
    expect(session.sessionId.equals(sessionId)).to.be.true
    expect(session.duration.toNumber()).to.equal(60)
    expect(session.completed).to.be.true

    const studentProfile = await program.account.userProfile.fetch(studentProfilePda)
    expect(studentProfile.totalSessions.toNumber()).to.equal(1)

    const mentorProfile = await program.account.userProfile.fetch(mentorProfilePda)
    expect(mentorProfile.totalSessions.toNumber()).to.equal(1)
  })

  it("updates reputation", async () => {
    await program.methods
      .updateReputation(new anchor.BN(60), 5)
      .accounts({
        reputationState: reputationPda,
        user: authority,
        userProfile: authorProfilePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const rep = await program.account.reputationState.fetch(reputationPda)
    expect(rep.sessionsCompleted.toNumber()).to.equal(1)
    expect(rep.score.toNumber()).to.be.greaterThan(0)
    expect(rep.peerRatings).to.deep.equal([5])
  })

  it("submits a funding request (score >= 10)", async () => {
    await program.methods
      .requestFunding(requestId, new anchor.BN(1_000_000_000), "Course materials")
      .accounts({
        fundingRequest: fundingPda,
        requester: authority,
        userProfile: authorProfilePda,
        treasury: treasuryPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const request = await program.account.fundingRequest.fetch(fundingPda)
    expect(request.requestId.equals(requestId)).to.be.true
    expect(request.amount.toNumber()).to.equal(1_000_000_000)
    expect(request.status).to.equal(0) // Pending
  })

  it("approves the funding request", async () => {
    await program.methods
      .approveFunding()
      .accounts({
        fundingRequest: fundingPda,
        treasury: treasuryPda,
        authority,
      })
      .rpc()

    const request = await program.account.fundingRequest.fetch(fundingPda)
    expect(request.status).to.equal(1) // Approved
  })

  it("distributes funds", async () => {
    const balanceBefore = await provider.connection.getBalance(authority)

    await program.methods
      .distributeFunds()
      .accounts({
        fundingRequest: fundingPda,
        userProfile: authorProfilePda,
        treasury: treasuryPda,
        requester: authority,
        authority,
      })
      .rpc()

    const request = await program.account.fundingRequest.fetch(fundingPda)
    expect(request.status).to.equal(3) // Distributed

    const balanceAfter = await provider.connection.getBalance(authority)
    expect(balanceAfter).to.be.greaterThan(balanceBefore - 1_000_000_000) // Account for fees
  })

  it("rejects funding requests for low reputation", async () => {
    const lowRepStudent = Keypair.generate()
    const [lowRepProfilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-profile"), lowRepStudent.publicKey.toBuffer()],
      program.programId
    )
    const [lowRepFundingPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("funding"), Keypair.generate().publicKey.toBuffer()],
      program.programId
    )

    await provider.connection.requestAirdrop(lowRepStudent.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)

    await program.methods
      .createUser("LowRep")
      .accounts({
        userProfile: lowRepProfilePda,
        authority: lowRepStudent.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([lowRepStudent])
      .rpc()

    try {
      await program.methods
        .requestFunding(Keypair.generate().publicKey, new anchor.BN(100_000_000), "Test")
        .accounts({
          fundingRequest: lowRepFundingPda,
          requester: lowRepStudent.publicKey,
          userProfile: lowRepProfilePda,
          treasury: treasuryPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([lowRepStudent])
        .rpc()
      expect.fail("Should have thrown InsufficientReputation error")
    } catch (err: any) {
      expect(err.message).to.include("InsufficientReputation")
    }
  })
})
