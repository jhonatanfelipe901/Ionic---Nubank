import { Component, Renderer2, ViewChild } from '@angular/core';
import { AnimationController, Animation, Platform, Gesture, GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('blocks') blocks: any;
  @ViewChild('backgrounds') backgrounds: any;
  @ViewChild('swipeDown') swipeDown: any;

  public options: Array<any> = [
    { icon: 'person-add-outline', text: 'Indicar amigos' },
    { icon: 'phone-portrait-outline', text: 'Recarga de celular' },
    { icon: 'logo-usd', text: 'Transferir' },
    { icon: 'card-outline', text: 'Empréstimos' },
    { icon: 'wallet-outline', text: 'Depositar' },
    { icon: 'options-outline', text: 'Ajustar limite' },
    { icon: 'help-circle-outline', text: 'Me ajuda' },
    { icon: 'barcode-outline', text: 'Pagar' },
    { icon: 'lock-open-outline', text: 'Bloquear' },
    { icon: 'card-outline', text: 'Cartão virtual' },
    { icon: 'help-outline', text: 'Me ajuda' },

  ]

  public slideOptions: any = {slidesPerView: 3, freeMode: true};

  public items: Array<any> = [
    { icon: 'help-circle-outline', text: 'Me ajuda' },
    { icon: 'person-outline', text: 'Perfil' },
    { icon: 'cash-outline', text: 'Configurar conta' },
    { icon: 'card-outline', text: 'Configurar cartão' },
    { icon: 'phone-portrait-outline', text: 'Configurações do app' }
  ]

  public initialStep: number = 0;
  public maxTranslate: number;
  public animation: Animation;
  public gesture: Gesture;
  public swipping: boolean = false;

  constructor(
    private animationCtrl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {
    this.maxTranslate = this.platform.height() - 200;
  }

  ngAfterViewInit(){
    this.createAnimation();
    this.detectSwipe();
  }

  detectSwipe(){
    this.gesture = this.gestureCtrl.create({
      el: this.swipeDown.el,
      gestureName: 'swipe-down',
      threshold: 0,
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev),
    }, true);
    this.gesture.enable(true);
  }

  onMove(ev: GestureDetail){
    if(!this.swipping){
      this.animation.direction('normal').progressStart(true);
      this.swipping = true;
    }

    const step: number = this.getStep(ev);

    this.animation.progressStep(step);
    this.setBackgroundOpacity(step);
  }

  getStep(ev: GestureDetail){

    const delta: number = this.initialStep + ev.deltaY;

    return delta /this.maxTranslate;
  }

  onEnd(ev: GestureDetail){
    if(!this.swipping) return;

    this.gesture.enable(false);

    const step: number = this.getStep(ev);
    const shouldComplete: boolean = step > 0.5;

    this.animation.progressEnd(shouldComplete ? 1 : 0, step);

    this.initialStep = shouldComplete ? this.maxTranslate : 0;

    this.setBackgroundOpacity();

    this.setBlocksOnEnd();

    this.swipping = false;
  }

  toggleBlocks(){
    this.initialStep = this.initialStep === 0 ? this.maxTranslate : 0;

    this.gesture.enable(false);

    this.animation.direction(this.initialStep == 0 ? 'reverse' : 'normal').play();

    this.setBackgroundOpacity();
  }

  createAnimation(){
    this.animation = this.animationCtrl.create()
    .addElement(this.blocks.nativeElement)
    .duration(300)
    .fromTo('transform', 'translateY(0)', `translateY(${this.maxTranslate}px)`)
    .onFinish(() => this.gesture.enable(true));
  }

  setBackgroundOpacity(value: number = null){
    this.renderer.setStyle(this.backgrounds.nativeElement,
    'opacity', value ? value : this.initialStep == 0 ? '0' : '1');
  }

  setBlocksOnEnd(){
    if(this.initialStep != 0){
      this.renderer.setStyle(this.blocks.nativeElement,
      'margin-top', '10px');
    }
    else{
      this.renderer.setStyle(this.blocks.nativeElement,
        'margin-top', '70px');
    }
  }

  fixedBlocks(): boolean{
    return this.swipping || this.initialStep === this.maxTranslate;
  }
}
