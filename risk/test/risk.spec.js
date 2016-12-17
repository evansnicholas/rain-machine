const risk = require('../dist/risk');
const expect = require('chai').expect;
const immutable = require('immutable');

describe('Risk', () => {
  describe('#computeWinner', () => {
    it('should correctly compute the winner', () => {
      const w = risk.computeWinner(1, 1);
      expect(w).to.equal(risk.Player.Defense);
    });

    it('should correctly compute the winner', () => {
      const w = risk.computeWinner(3, 1);
      expect(w).to.equal(risk.Player.Attack);
    });

    it('should correctly compute the winner', () => {
      const w = risk.computeWinner(3, 4);
      expect(w).to.equal(risk.Player.Defense);
    });

    it('should correctly compute the winner', () => {
      const w = risk.computeWinner(4, 4);
      expect(w).to.equal(risk.Player.Defense);
    });
  });

  describe('#computeBattleResult', () => {
    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([1])), new risk.Play(immutable.List([1])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(1);
      expect(result.defenseLoss).to.equal(0);
    });

    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([2])), new risk.Play(immutable.List([1])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(0);
      expect(result.defenseLoss).to.equal(1);
    });

    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([4, 5])), 
        new risk.Play(immutable.List([5])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(1);
      expect(result.defenseLoss).to.equal(0);
    });

    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([2, 5, 3])), 
        new risk.Play(immutable.List([4, 4])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(1);
      expect(result.defenseLoss).to.equal(1);
    });

    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([1, 3, 6])), 
        new risk.Play(immutable.List([6, 3])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(2);
      expect(result.defenseLoss).to.equal(0);
    });

    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([1, 3, 6])), 
        new risk.Play(immutable.List([3, 6])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(2);
      expect(result.defenseLoss).to.equal(0);
    });

    it('should compute the correct outcome', () => {
      const battle = new risk.Battle(new risk.Play(immutable.List([6])), 
        new risk.Play(immutable.List([3])));
      const result = risk.computeBattleResult(battle);
      expect(result.attackLoss).to.equal(0);
      expect(result.defenseLoss).to.equal(1);
    });
  });

  describe('#computeAllPossiblePlays', () => {
    it('should compute the correct plays for 1 dice', () => {
      const plays = risk.computeAllPossiblePlays(1);
      expect(plays.size).to.equal(6);
    });

    it('should compute the correct combos for 2 dice', () => {
      const plays = risk.computeAllPossiblePlays(2);
      expect(plays.size).to.equal(36);
    });

    it('should compute the correct combos for 3 dice', () => {
      const plays = risk.computeAllPossiblePlays(3);
      expect(plays.size).to.equal(216);
    });
  });

  describe('#findAllBattles', () => {
    it('should find all the battles', () => {
      const allBattles = risk.findAllBattles(1, 1);
      expect(allBattles.size).to.equal(36);
    });

    it('should find all the battles', () => {
      const allBattles = risk.findAllBattles(2, 1);
      expect(allBattles.size).to.equal(216);
    });

    it('should find all the battles', () => {
      const allBattles = risk.findAllBattles(2, 2);
      expect(allBattles.size).to.equal(1296);
    });
  });

  describe('play risk', () => {
    const allBattles = risk.findAllBattles(4, 2);
    const allWinningBattles = allBattles
      .map(risk.computeBattleResult)
      .filter(battle => battle.defenseLoss == 1);
      
    console.log(allWinningBattles.size);
    console.log(allWinningBattles.size / allBattles.size);
  });
});