"use strict";
var immutable_1 = require("immutable");
var Player;
(function (Player) {
    Player[Player["Attack"] = 0] = "Attack";
    Player[Player["Defense"] = 1] = "Defense";
})(Player = exports.Player || (exports.Player = {}));
var die = immutable_1.List([1, 2, 3, 4, 5, 6]);
var Play = (function () {
    function Play(dice) {
        this.dice = dice;
    }
    ;
    Play.init = function () {
        return die.map(function (n) { return new Play(immutable_1.List([n])); }).toList();
    };
    Play.prototype.addDie = function () {
        var _this = this;
        return die.map(function (d) { return new Play(_this.dice.concat(d).toList()); }).toList();
    };
    Play.prototype.getSortedDice = function () {
        return this.dice.sort().toList();
    };
    return Play;
}());
exports.Play = Play;
var Battle = (function () {
    function Battle(attack, defense) {
        this.attack = attack;
        this.defense = defense;
    }
    return Battle;
}());
exports.Battle = Battle;
var BattleResult = (function () {
    function BattleResult(attackLoss, defenseLoss) {
        this.attackLoss = attackLoss;
        this.defenseLoss = defenseLoss;
    }
    BattleResult.init = function () {
        return new BattleResult(0, 0);
    };
    BattleResult.prototype.addResult = function (winner) {
        switch (winner) {
            case Player.Attack: return this.attackWins();
            case Player.Defense: return this.defenseWins();
        }
    };
    BattleResult.prototype.attackWins = function () {
        return new BattleResult(this.attackLoss, this.defenseLoss + 1);
    };
    BattleResult.prototype.defenseWins = function () {
        return new BattleResult(this.attackLoss + 1, this.defenseLoss);
    };
    return BattleResult;
}());
exports.BattleResult = BattleResult;
function computeWinner(attack, defense) {
    if (attack > defense) {
        return Player.Attack;
    }
    else {
        return Player.Defense;
    }
}
exports.computeWinner = computeWinner;
function computeBattleResult(battle) {
    var sortedAttack = battle.attack.getSortedDice().reverse();
    var sortedDefense = battle.defense.getSortedDice().reverse();
    var attackDice = sortedAttack.take(sortedDefense.size);
    return attackDice.reduce(function (battleResult, attackDie, key) {
        var defenseDie = sortedDefense.get(key);
        var winner = computeWinner(attackDie, defenseDie);
        return battleResult.addResult(winner);
    }, BattleResult.init());
}
exports.computeBattleResult = computeBattleResult;
function computeAllPossiblePlays(diceNumber) {
    if (diceNumber === 0) {
        throw new Error('Must play with at least one die');
    }
    var additionalDie = immutable_1.Repeat(0, diceNumber - 1);
    return additionalDie.reduce(function (allPlays, newPlay) {
        return allPlays.flatMap(function (p) { return p.addDie(); }).toList();
    }, immutable_1.List(Play.init()));
}
exports.computeAllPossiblePlays = computeAllPossiblePlays;
function findAllBattles(attackers, defenders) {
    var allAttacks = computeAllPossiblePlays(attackers);
    var allDefense = computeAllPossiblePlays(defenders);
    var initBattles = immutable_1.List();
    return allAttacks.flatMap(function (newAttack) {
        return allDefense.map(function (defense) {
            return new Battle(newAttack, defense);
        }).toList();
    }).toList();
}
exports.findAllBattles = findAllBattles;
