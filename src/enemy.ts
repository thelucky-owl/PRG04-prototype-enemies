import * as PIXI from 'pixi.js'
import { Application, ObservablePoint, Sprite, Texture } from 'pixi.js'
import '@pixi/math-extras'
import {Game} from "./game"


export class Enemy extends PIXI.AnimatedSprite{
    //not used yet so commented out
    // private xSpeed: number = 1
    private speed: number = 1
    // private ySpeed: number = 0
    public health: number = 4
    private game: Game
    public previousHit:boolean = false
    public currentHit:boolean = false
    private active:boolean= false
    public knockback:boolean = false

    constructor(textures: Texture[], game:Game){
        super(textures)
        this.game = game
        this.x = Math.random()* game.pixi.screen.right
        this.y = Math.random()* game.pixi.screen.bottom
        this.scale.set(-1,1)
        this.anchor.set(0.5)
        this.animationSpeed = 0.1
        this.tint = Math.random() * 0xFFFFFF
        this.play()
    }
    
    updateEnemy(delta:number, playerPosition: PIXI.Point){
        super.update(delta)
        this.checkCollision()
        //move enemy to left side of screen when they go off the right
        if(this.x > 850){
            this.x = -150
        }
        //set x to +1, timer goes, set x-1 repeat, if active stop and follow player, movement before following player
        const direction = playerPosition.subtract(this.position).normalize();
        //calculate the distance from the player
        const xDifference = this.position.x - playerPosition.x
        const yDifference = playerPosition.y - this.position.y
        const difference = Math.sqrt( xDifference * xDifference + yDifference*yDifference)
        //check how close the player is
        if(difference < 200){
            this.active = true
        }
        //start following the player
        if(this.active == true){
            if(this.knockback == true){
                console.log(this.knockback)
                this.speed = 20
                const progress = direction.multiplyScalar(this.speed * -1);
                this.position = this.position.add(progress) as ObservablePoint;

            }else
            this.speed =1
            this.position = this.position.add(direction) as ObservablePoint;
        }
    }

    private checkCollision() {
        if(this.currentHit && !this.previousHit) {
            this.health--
            console.log(this.previousHit)
        }

        this.previousHit = this.currentHit
    }
    takeDamage() {
        // maybe do something with different weapons, more damage whatever
        // bijv. this.health -= player.weapon.damage
        if (!this.previousHit) {
            console.log(this.health)
            this.health -= 1
            this.knockback = true
            //check for death
            if (this.health <= 0) {
                this.game.enemyArray = this.game.enemyArray.filter(f => f != this)
                this.destroy()
            }
        }
       
    }
    
}

//not working yet so commented out
