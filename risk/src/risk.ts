import * as _ from 'lodash';
import { List, Repeat } from 'immutable';

export enum Player {
    Attack,
    Defense
}

const die = List([1, 2, 3, 4, 5, 6]);

export class Play {

    constructor(private dice: List<number>) { };

    static init(): List<Play> {
        return die.map(n => new Play(List([n]))).toList();
    }

    addDie(): List<Play> {
        return die.map(d => new Play(this.dice.concat(d).toList())).toList();
    }

    getSortedDice(): List<number> {
        return this.dice.sort().toList();
    }
}

export class Battle {
    constructor(public attack: Play, public defense: Play) { }
}

export class BattleResult {

    static init(): BattleResult {
        return new BattleResult(0, 0);
    }

    constructor(public attackLoss: number, public defenseLoss: number) { }

    addResult(winner: Player): BattleResult {
        switch (winner) {
            case Player.Attack: return this.attackWins();
            case Player.Defense: return this.defenseWins();
        }
    }

    attackWins(): BattleResult {
        return new BattleResult(this.attackLoss, this.defenseLoss + 1);
    }

    defenseWins(): BattleResult {
        return new BattleResult(this.attackLoss + 1, this.defenseLoss);
    }
}

export function computeWinner(attack: number, defense: number): Player {
    if (attack > defense) {
        return Player.Attack;
    } else {
        return Player.Defense;
    }
}

export function computeBattleResult(battle: Battle): BattleResult {
    const sortedAttack = battle.attack.getSortedDice().reverse();
    const sortedDefense = battle.defense.getSortedDice().reverse();
    const attackDice = sortedAttack.take(sortedDefense.size);
    return attackDice.reduce((battleResult, attackDie, key) => {
        const defenseDie = sortedDefense.get(key);
        const winner = computeWinner(attackDie, defenseDie);
        return battleResult.addResult(winner);
    }, BattleResult.init());
}

export function computeAllPossiblePlays(diceNumber: number): List<Play> {
    if (diceNumber === 0) {
        throw new Error('Must play with at least one die');
    }
    const additionalDie = Repeat(0, diceNumber - 1);
    return additionalDie.reduce((allPlays, newPlay) => {
        return allPlays.flatMap(p => p.addDie()).toList();
    }, List<Play>(Play.init()));
}

export function findAllBattles(attackers: number, defenders: number): List<Battle> {
    const allAttacks = computeAllPossiblePlays(attackers);
    const allDefense = computeAllPossiblePlays(defenders);
    const initBattles: List<Battle> = List<Battle>();
    return allAttacks.flatMap((newAttack) => {
        return allDefense.map(defense => {
            return new Battle(newAttack, defense);
        }).toList();
    }).toList();
}

