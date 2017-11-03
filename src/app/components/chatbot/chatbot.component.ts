import {
    ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnDestroy, OnInit,
    ViewChild
} from '@angular/core';
import {messages} from '../../utils/chatbot-commonMessages';
import {LoaderMessageComponent} from '../loader-message/loader-message.component';
import {ChatbotCommunicationService} from '../../services/component-communicators/chatbot-communication.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
    entryComponents: [LoaderMessageComponent]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatFlowList') chatFlowList: ElementRef;
  @ViewChild('chatFlowContainer') chatFlowContainer: ElementRef;
  @ViewChild('resonsesContainer') resonsesContainer: ElementRef;
  chatFlow: any[];
  responses: any[];
  user_inputs: any[];
  public messages: any;
  public showedInfoIndex: number;
  public infoBoxClickCount: number;
  public lang: string;
    public paramsSubscription: Subscription;
    public infoBoxSubscription: Subscription;

  constructor(private resolver: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef,
              private chatbotCommunicationService: ChatbotCommunicationService,
              private activatedRoute: ActivatedRoute) {
      this.messages = messages;
      this.infoBoxClickCount = 0;
      this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
          this.lang = params['lang'];
          if (typeof this.lang === 'undefined') {
              this.lang = 'en';
          }
      });
    this.chatFlow = [
      {
        message: {
            en: 'Hey, Nice to meet you!. What do you want help with?',
            sv: 'Hej trevligt att träffas!. Vad vill du ha hjälp med?'
        },
        info: {
            en: 'This is welcome message info!',
            sv: 'Detta är välkommen meddelande information!'
        },
        type: 'response',
        user_input: [
          {
            message: {
                en: 'I would like to get help.',
                sv: 'Jag skulle vilja få hjälp.'
            },
            type: 'user',
            response:
              {
                message: {
                    en: 'Great! Was it helpful?',
                    sv: 'Bra! Var det till hjälp?'
                },
                info: {
                    en: 'We would be appreciated to get feedback from you.',
                    sv: 'Vi skulle uppskatta att få feedback från dig.'
                },
                type: 'response',
                user_input: [
                  {
                    message: {
                        en: this.messages.three.en,
                        sv: this.messages.three.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.one.en,
                            sv: this.messages.one.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  },
                  {
                    message: {
                        en: this.messages.four.en,
                        sv: this.messages.four.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.two.en,
                            sv: this.messages.two.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  }
                ]
              }
          },
          {
            message: {
                en: 'Where is KarX located?',
                sv: 'Var ligger KarX?'
            },
            type: 'user',
            response:
              {
                message: {
                    en: 'It is located in Nymble. Was it helpful?',
                    sv: 'Det ligger i Nymble. Var det till hjälp?'
                },
                info: null,
                type: 'response',
                user_input: [
                  {
                    message: {
                        en: this.messages.three.en,
                        sv: this.messages.three.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.one.en,
                            sv: this.messages.one.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  },
                  {
                    message: {
                        en: this.messages.four.en,
                        sv: this.messages.four.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.two.en,
                            sv: this.messages.two.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  }
                ]
              }
          },
          {
            message: {
                en: 'I want to become a member',
                sv: 'Jag vill bli medlem'
            },
            type: 'user',
            response:
              {
                message: {
                    en: 'Great! Have you semester registered?',
                    sv: 'Bra! Har du registrerat semester?'
                },
                info: null,
                type: 'response',
                user_input: [
                  {
                    message: {
                        en: this.messages.three.en,
                        sv: this.messages.three.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: 'Have you paid the membership fee? (365kr)?',
                            sv: 'Har du betalat medlemsavgiften? (365kr)?'
                        },
                        info: null,
                        type: 'response',
                          user_input: [
                              {
                                  message: {
                                      en: this.messages.three.en,
                                      sv: this.messages.three.sv
                                  },
                                  type: 'user',
                                  response:
                                      {
                                          message: {
                                              en: 'Have you checked that you use your kth-adress at SSSB?',
                                              sv: 'Har du kontrollerat att du använder din kth-adress på SSSB?'
                                          },
                                          info: null,
                                          type: 'response',
                                          user_input: [
                                              {
                                                  message: {
                                                      en: this.messages.three.en,
                                                      sv: this.messages.three.sv
                                                  },
                                                  type: 'user',
                                                  response:
                                                      {
                                                          message: {
                                                              en: 'Perfect! It will take between 2-3 weeks until you get your card! Enjoy!',
                                                              sv: 'Perfekt! Det tar mellan 2-3 veckor tills du får ditt kort! Njut av!'
                                                          },
                                                          info: null,
                                                          type: 'response',
                                                      }
                                              },
                                              {
                                                  message: {
                                                      en: this.messages.four.en,
                                                      sv: this.messages.four.sv
                                                  },
                                                  type: 'user',
                                                  response:
                                                      {
                                                          message: {
                                                              en: this.messages.two.en,
                                                              sv: this.messages.two.sv
                                                          },
                                                          info: null,
                                                          type: 'response',
                                                      }
                                              }
                                          ]
                                      }
                              },
                              {
                                  message: {
                                      en: this.messages.four.en,
                                      sv: this.messages.four.sv
                                  },
                                  type: 'user',
                                  response:
                                      {
                                          message: {
                                              en: this.messages.two.en,
                                              sv: this.messages.two.sv
                                          },
                                          info: null,
                                          type: 'response',
                                      }
                              }
                          ]
                      }
                  },
                  {
                    message: {
                        en: this.messages.four.en,
                        sv: this.messages.four.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.two.en,
                            sv: this.messages.two.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  }
                ]
              }
          },
          {
            message: {
                en: 'Who should I contact?',
                sv: 'Vem ska jag kontakta?'
            },
            type: 'user',
            response:
              {
                message: {
                    en: 'THS! Was it helpful?',
                    sv: 'THS! Var det till hjälp?'
                },
                info: null,
                type: 'response',
                user_input: [
                  {
                    message: {
                        en: this.messages.three.en,
                        sv: this.messages.three.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.one.en,
                            sv: this.messages.one.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  },
                  {
                    message: {
                        en: this.messages.four.en,
                        sv: this.messages.four.sv
                    },
                    type: 'user',
                    response:
                      {
                        message: {
                            en: this.messages.two.en,
                            sv: this.messages.two.sv
                        },
                        info: null,
                        type: 'response',
                      }
                  }
                ]
              }
          },
        ]
      }
    ];
  }

    resetChatbot(): void {
        this.initChatflow();
    }

    showInfo(index): void {
        this.infoBoxClickCount += 1;
        this.showedInfoIndex = index;
      // if (this.showedInfoIndex === index) {
      //     this.hideInfoBox();
      // }else {
      //
      // }
    }

    hideInfoBox(): void {
      this.showedInfoIndex = -1;
    }

  addItemToChatFlow(event, index) {
    const rect = this.chatFlowList.nativeElement.lastElementChild;
    let top: number;
    let height: number;
    if (rect !== 'undefined') {
      top = rect.offsetTop;
      height = rect.getElementsByClassName('response')[0].offsetHeight;
    }else {
      top = 15;
      height = 0;
    }
    const x = this.chatFlowContainer.nativeElement.offsetWidth - event.target.offsetWidth - 10 - 5 - event.target.offsetLeft;
    const y = this.chatFlowContainer.nativeElement.offsetHeight - top - this.resonsesContainer.nativeElement.offsetHeight - height + 5;
    event.target.style.transform = 'translate3d(' + x + 'px, -' + y + 'px, 0px)';
    const self = this;
    console.log('ww');
    setTimeout(function(){
      self.responses.push({
        message: self.user_inputs[index].message,
        type: 'user'
      });
      self.addDynamicComponent();
      const old_user_inputs = self.user_inputs;
      self.user_inputs = [];
      setTimeout(function () {
          console.log(self.chatFlowList.nativeElement.lastElementChild);
          self.chatFlowList.nativeElement.lastElementChild.remove();
          self.responses.push({
              message: old_user_inputs[index].response.message,
              info: old_user_inputs[index].response.info,
              type: 'response'
          });
          const user_input = old_user_inputs[index].response.user_input;
          self.user_inputs = user_input;
      }, 1000);
    }, 500);
  }

    addDynamicComponent() {
        const factory = this.resolver.resolveComponentFactory(LoaderMessageComponent);
        const newNode = document.createElement('div');
        newNode.id = 'loader-wrapper';
        this.chatFlowList.nativeElement.appendChild(newNode);
        const ref = factory.create(this.injector, [], newNode);
        this.appRef.attachView(ref.hostView);
    }

    initChatflow(): void {
        this.responses = [{
            message: this.chatFlow[0].message,
            info: this.chatFlow[0].info,
            type: 'response'
        }];
        this.user_inputs = this.chatFlow[0].user_input;
    }

  ngOnInit() {
      this.initChatflow();
    this.infoBoxSubscription = this.chatbotCommunicationService.hideInfoBoxObservable$.subscribe(() => {
        console.log(this.showedInfoIndex);
        console.log(this.infoBoxClickCount);
        if (this.infoBoxClickCount === 0 && this.showedInfoIndex > -1) {
            this.hideInfoBox();
        }else {
            this.infoBoxClickCount = 0;
        }
    });
  }

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
        if (this.infoBoxSubscription) {
            this.infoBoxSubscription.unsubscribe();
        }
    }
}
