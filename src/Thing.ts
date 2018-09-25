import { numberPair } from "./types"

export default class Thing {
  public pos: numberPair
  public vel: numberPair
  public size: numberPair
  public footprint: numberPair
  public angle: number

  constructor(pos: numberPair, size: numberPair, vel: numberPair) {
    this.pos = pos

    this.size = size
    this.footprint = [this.size[0], this.size[1] / 3]

    this.vel = vel ? vel : [0, 0]
    this.angle = 0 // radians
  }

  public update(dt: number, _?: any): boolean {
    if (!this.vel || !this.pos) {
      return true
    }
    if (this.vel[0] !== 0 || this.vel[1] !== 0) {
      const deltaX = this.vel[0] * dt
      const deltaY = this.vel[1] * dt
      this.pos[0] += deltaX
      this.pos[1] += deltaY
    }

    // lockToScreen(this, false);
    return true
  }

  /*Thing.prototype.getCenter = function() {
        return [this.pos[0]+(this.size/2), this.pos[1]+(this.size/2)];
    };*/
  /*Thing.prototype.containsPoint = function(p) {
        var v = calcVector(p, this.getCenter());
        var dist = calcDistance(v);
        if (dist <= this.size/2) {
            return true;
        } else {
            return false;
        }
    };*/
  public collideThing(other: Thing) {
    const thispos = this._getOwnPos()
    const otherpos = other._getOwnPos()

    if (
      thispos[0] + this.footprint[0] < otherpos[0] ||
      thispos[0] > otherpos[0] + other.footprint[0] ||
      thispos[1] > otherpos[1] + other.size[1] ||
      thispos[1] + this.size[1] <
      otherpos[1] + other.size[1] - other.footprint[1]
    ) {
      return false
    } else {
      return true
    }
  }
  public getCenter(): numberPair {
    const pos = this._getOwnPos()
    return [pos[0] + this.footprint[0] / 2, pos[1] + this.footprint[1] / 2]
  }
  public getCollisionPos(): numberPair {
    return this.pos
  }
  public _getOwnPos() {
    // will this call getCollisionPos() on a child class?
    const thispos = this.getCollisionPos()
    return thispos
  }
  /*Thing.prototype.circleCollide = function(otherThing) {
        var p1 = [this.pos[0] + this.size/2, this.pos[1] + this.size/2];
        var p2 = [otherThing.pos[0] + otherThing.size/2, otherThing.pos[1] + otherThing.size/2];
        var dist = calcDistance(calcVector(p1, p2));
        return dist < this.size/2 + otherThing.size/2;
    };*/
  /*Thing.prototype.damage = function(n) {
        this.health -= n;
        if (this.health <= 0) {
            console.log('dead');
        }
    };*/
}
