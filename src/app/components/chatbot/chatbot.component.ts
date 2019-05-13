import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { messages } from "../../utils/chatbot-commonMessages";
import { LoaderMessageComponent } from "../loader-message/loader-message.component";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { HideUICommunicationService } from "../../services/component-communicators/hide-ui-communication.service";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: "app-chatbot",
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.scss"],
  entryComponents: [LoaderMessageComponent]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild("chatFlowList") chatFlowList: ElementRef;
  @ViewChild("chatFlowContainer") chatFlowContainer: ElementRef;
  @ViewChild("resonsesContainer") resonsesContainer: ElementRef;
  chatFlow: any[];
  responses: any[];
  user_inputs: any[];
  public messages: any;
  public showedInfoIndex: number;
  public infoBoxClickCount: number;
  public lang: string;
  public paramsSubscription: Subscription;
  public infoBoxSubscription: Subscription;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private hideUICommunicationService: HideUICommunicationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.messages = messages;
    this.infoBoxClickCount = 0;
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        }
      }
    );

    this.messages.welcome_en =
      "Hey, Nice to meet you!. What do you want help with?";
    this.messages.welcome_sv =
      "Hej, trevligt att träffas!. Vad vill du ha hjälp med?";

    this.chatFlow = [
      {
        message: {
          en: this.messages.welcome_en,
          sv: this.messages.welcome_sv
        },
        info: {
          en: "This is welcome message!",
          sv: "Detta är välkomstmeddelande!"
        },
        type: "response",
        user_input: [
          {
            message: {
              en: "I want to become a member!",
              sv: "Jag vill bli medlem!"
            },
            type: "user",
            response: {
              message: {
                en:
                  "Great! Before we start. Have you registered for this semester? You can check it <a target='_blank' href='https://www.student.ladok.se/student/#/installningar'>here</a>",
                sv:
                  "Vad roligt! Innan vi startar igång. Har du kursregistrerat dig? Du kan kontrollera det här: <a target='_blank' href='https://www.student.ladok.se/student/#/installningar'>här</a>"
              },
              info: {
                en:
                  "<a target='_blank' href='https://www.kth.se/en/student/kurs/kursregistrering-1.317058'> General information about course registration.</a> You can also contact your study counselor for more information",
                sv:
                  "Information om kursregistrering hittar du <a target='_blank' href='https://www.kth.se/student/kurs/kursregistrering-1.317058'>här</a>. Du kan också kontakta din studievägledare för mer information"
              },
              type: "response",
              user_input: [
                {
                  message: {
                    en: "Yes",
                    sv: "Ja"
                  },
                  type: "user",
                  response: {
                    message: {
                      en:
                        "Great! Have you paid the membership fee? The membership is for the full academic year. ",
                      sv:
                        "Superbra! Har du betalat medlemsavgiften? Ett medlemskap gäller hela läsåret. Vi tar emot Swish eller kort. "
                    },
                    info: null,
                    type: "response",
                    user_input: [
                      {
                        message: {
                          en: "Yes",
                          sv: "Ja"
                        },
                        type: "user",
                        response: {
                          message: {
                            en:
                              "Perfect! Now you are a registered THS Member. Do you have any further questions? ",
                            sv:
                              "Perfekt! Nu är du en fullvärdig THS-Medlem. Har du några flera frågor?"
                          },
                          info: null,
                          type: "response",
                          user_input: [
                            {
                              message: {
                                en: "I want to collect queue-days at SSSB",
                                sv: "Jag vill samla ködagar hos SSSB"
                              },
                              type: "user",
                              response: {
                                message: {
                                  en:
                                    "No problem! In order for the system to synchronize you need to use your KTH-email at SSSB website. You can change it <a target='_blank' href='https://www.sssb.se/en/my-pages/my-contact-details'>here</a>",
                                  sv:
                                    "Inga problem! För att systemen ska synkronisera korrekt så behöver du använda din KTH mail hos SSSB. Du kan ändra det <a target='_blank' href='https://www.sssb.se/sv/my-pages/my-contact-details'>här</a>"
                                },
                                info: null,
                                type: "response"
                              }
                            },
                            {
                              message: {
                                en: this.messages.four.en,
                                sv: this.messages.four.sv
                              },
                              type: "user",
                              response: {
                                message: {
                                  en:
                                    "Ok! I hope this was helpful! Good luck with your studies ;)",
                                  sv:
                                    "Ok! Jag hoppas att jag lyckades besvara dina funderingar. Stort lycka till med studierna. ;)"
                                },
                                info: null,
                                type: "response"
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
                        type: "user",
                        response: {
                          message: {
                            en:
                              "Ok, no problem! You can do it <a target='_blank' href='https://ths.kth.se/login'>here</a>",
                            sv:
                              "Ok! Inga problem! Du kan betala medlemsavgiften <a target='_blank' href='https://ths.kth.se/login'>här</a>"
                          },
                          info: null,
                          type: "response",
                          user_input: [
                            {
                              message: {
                                en: "I have paid the membership fee",
                                sv: "Jag har betalat medlemsavgiften"
                              },
                              type: "user",
                              response: {
                                message: {
                                  en:
                                    "Perfect! Now you are a registered THS Member. Do you have any further questions? ",
                                  sv:
                                    "Perfekt! Nu är du en fullvärdig THS-Medlem. Har du några flera frågor?"
                                },
                                info: null,
                                type: "response",
                                user_input: [
                                  {
                                    message: {
                                      en:
                                        "I want to collect queue-days at SSSB",
                                      sv: "Jag vill samla ködagar hos SSSB"
                                    },
                                    type: "user",
                                    response: {
                                      message: {
                                        en:
                                          "No problem! In order for the system to synchronize you need to use your KTH-email at SSSB website. You can change it <a target='_blank' href='https://www.sssb.se/en/my-pages/my-contact-details'>here</a>",
                                        sv:
                                          "Inga problem! För att systemen ska synkronisera korrekt så behöver du använda din KTH mail hos SSSB. Du kan ändra det <a target='_blank' href='https://www.sssb.se/sv/my-pages/my-contact-details'>här</a>"
                                      },
                                      info: null,
                                      type: "response"
                                    }
                                  },
                                  {
                                    message: {
                                      en: "No",
                                      sv: "Nej"
                                    },
                                    type: "user",
                                    response: {
                                      message: {
                                        en:
                                          "Ok! I hope this was helpful! Good luck with your studies ;)",
                                        sv:
                                          "Ok! Jag hoppas att jag lyckades besvara dina funderingar. Stort lycka till med studierna. ;)"
                                      },
                                      info: null,
                                      type: "response"
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  message: {
                    en: "No",
                    sv: "Nej"
                  },
                  type: "user",
                  response: {
                    message: {
                      en:
                        "Okay! In order to become a student member of THS, you need to have an active course registration at KTH. If you are only admitted to a course, but not registered, then it is not sufficient. You can check your registration <a target='_blank' href='https://www.student.ladok.se/student/#/installningar'>here</a>.",
                      sv:
                        "Okej! För att bli THS-medlem måste du ha en aktiv kursregistrering på KTH. Om du bara är antagen till en kurs, men inte registrerad, är det inte tillräckligt. Du kan kontrollera din registrering  <a target='_blank' href='https://www.student.ladok.se/student/#/installningar'>här</a>."
                    },
                    info: null,
                    type: "response",
                    user_input: [
                      {
                        message: {
                          en: "I have registered for my courses this term",
                          sv: "Jag har kursregistrerat mig denna termin"
                        },
                        type: "user",
                        response: {
                          message: {
                            en:
                              "Thank you! Next step is to pay the membership fee. The membership is valid for a full academic year. You can pay <a target='_blank' href='https://ths.kth.se/login'>here</a> ",
                            sv:
                              "Tack så mycket! Nästa steg är att betala medlemsavgiften. Medlemskapet gäller i ett läsår. Du kan betala <a target='_blank' href='https://ths.kth.se/login'>här</a>"
                          },
                          info: {
                            en:
                              "Our membership system is called arcMember and you can login with your KTH-id <a target='_blank' href='https://ths.kth.se/login'>here</a> ",
                            sv:
                              "Vårt medlemssytem heter arcMember och du kan logga in med ditt KTH-id <a target='_blank' href='https://ths.kth.se/login'>här</a>"
                          },
                          type: "response",
                          user_input: [
                            {
                              message: {
                                en: "I have paid the membership fee",
                                sv: "Jag har betalat medlemsavgiften"
                              },
                              type: "user",
                              response: {
                                message: {
                                  en:
                                    "Perfect! Now you are a registered THS Member. Do you have any further questions? ",
                                  sv:
                                    "Perfekt! Nu är du en fullvärdig THS-Medlem. Har du några flera frågor?"
                                },
                                info: null,
                                type: "response",
                                user_input: [
                                  {
                                    message: {
                                      en:
                                        "I want to collect queue-days at SSSB",
                                      sv: "Jag vill samla ködagar hos SSSB"
                                    },
                                    type: "user",
                                    response: {
                                      message: {
                                        en:
                                          "No problem! In order for the system to synchronize you need to use your KTH-email at SSSB website. You can change it <a target='_blank' href='https://www.sssb.se/en/my-pages/my-contact-details'>here</a>",
                                        sv:
                                          "Inga problem! För att systemen ska synkronisera korrekt så behöver du använda din KTH mail hos SSSB. Du kan ändra det <a target='_blank' href='https://www.sssb.se/sv/my-pages/my-contact-details'>här</a>"
                                      },
                                      info: null,
                                      type: "response"
                                    }
                                  },
                                  {
                                    message: {
                                      en: "No",
                                      sv: "Nej"
                                    },
                                    type: "user",
                                    response: {
                                      message: {
                                        en:
                                          "Ok! I hope this was helpful! Good luck with your studies ;)",
                                        sv:
                                          "Ok! Jag hoppas att jag lyckades besvara dina funderingar. Stort lycka till med studierna. ;)"
                                      },
                                      info: null,
                                      type: "response"
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            message: {
              en: "Why am I missing the SL-logo on my card?",
              sv: "Varför saknar jag SL-loggan på mitt studentkort?"
            },
            type: "user",
            response: {
              message: {
                en:
                  "To be eligible for the SL discount, you must meet the following criteria: <p>– You must be registered for at least 75% activity at KTH. You can check your registrations <a href='https://www.student.ladok.se/student/#/installningar'>here.</a> If you are only admitted to the course, and not registered, then it is not sufficient for this requirement. <br> – If you are a PhD-student, your department must have registered your activity for your current semester in Ladok. This is done manually by KTH and therefore it might take some time. You can also provide us with a signed paper from your supervisor, stating your pace of study.<br> – You must have an email-address and current address registered in Ladok. You can check your information <a href='https://www.student.ladok.se/student/#/installningar'>here.</a></p>",
                sv:
                  "För att vara berättigad till SL-rabatten måste du uppfylla nedan kriterier: <p>– Du måste vara registrerad för minst 75% aktivitet på KTH. Du kan kontrollera dina registreringar <a href='https://www.student.ladok.se/student/#/installningar'>här.</a> Det räcker inte att vara antagen till en kurs, utan du måste också vara registrerad.<br> – Om du är Doktorand måste din avdelning registrera dig för aktuell termin i Ladok. Detta görs manuellt av KTH och därför kan det ta lite tid. Du kan också bifoga ett skriftligt underlag från din handledare som bevisar din aktivitet.<br> - Du måste ha en e-postadress och en adress registrerad i Ladok. Du kan kontrollera dina information <a href='https://www.student.ladok.se/student/#/installningar'>här.</a></p>"
              },
              info: {
                en:
                  "<a target='_blank' href='https://www.kth.se/en/student/kurs/kursregistrering-1.317058'> General information about course registration.</a> You can also contact your study counselor for more information",
                sv:
                  "Information om kursregistrering hittar du <a target='_blank' href='https://www.kth.se/student/kurs/kursregistrering-1.317058'>här</a>. Du kan också kontakta din studievägledare för mer information"
              },
              type: "response"
            }
          },
          {
            message: {
              en: "I want to order a physical card",
              sv: "Jag vill beställa ett fysiskt studentkort"
            },
            type: "user",
            response: {
              message: {
                en:
                  "No problem! You can order a physical card <a target='_blank' href='https://help.mecenat.com/hc/en-gb/articles/115005725326-I-want-a-physical-Mecenat-card'>here</a>",
                sv:
                  "Inga problem! Du kan beställa ett fysiskt studentkort <a target='_blank' href='https://help.mecenat.com/hc/sv/articles/115005725326-Jag-vill-ha-ett-fysiskt-Mecenatkort'>här</a>"
              },
              info: null,
              type: "response"
            }
          }
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
  }

  hideInfoBox(): void {
    this.showedInfoIndex = -1;
  }

  addItemToChatFlow(event, index) {
    const rect = this.chatFlowList.nativeElement.lastElementChild;
    let top: number;
    let height: number;
    if (rect !== "undefined") {
      if (rect === null) {
        top = 0;
        height = 0;
      } else {
        top = rect.offsetTop;
        height = rect.getElementsByClassName("response")[0].offsetHeight;
      }
    } else {
      top = 15;
      height = 0;
    }
    const x =
      this.chatFlowContainer.nativeElement.offsetWidth -
      event.target.offsetWidth -
      10 -
      5 -
      event.target.offsetLeft;
    const y =
      this.chatFlowContainer.nativeElement.offsetHeight -
      top -
      this.resonsesContainer.nativeElement.offsetHeight -
      height +
      5;
    event.target.style.transform =
      "translate3d(" + x + "px, -" + y + "px, 0px)";
    const self = this;
    setTimeout(function() {
      self.responses.push({
        message: self.user_inputs[index].message,
        type: "user"
      });
      self.addDynamicComponent();
      const old_user_inputs = self.user_inputs;
      self.user_inputs = [];
      setTimeout(function() {
        self.chatFlowList.nativeElement.lastElementChild.remove();
        self.responses.push({
          message: old_user_inputs[index].response.message,
          info: old_user_inputs[index].response.info,
          type: "response"
        });
        const user_input = old_user_inputs[index].response.user_input;
        self.user_inputs = user_input;
      }, 1000);
    }, 500);
  }

  addDynamicComponent() {
    const factory = this.resolver.resolveComponentFactory(
      LoaderMessageComponent
    );
    const newNode = document.createElement("div");
    newNode.id = "loader-wrapper";
    this.chatFlowList.nativeElement.appendChild(newNode);
    const ref = factory.create(this.injector, [], newNode);
    this.appRef.attachView(ref.hostView);
  }

  initChatflow(): void {
    /*this.responses = [{
            message: this.chatFlow[0].message,
            info: this.chatFlow[0].info,
            type: 'response'
        }];*/
    this.responses = [];
    this.user_inputs = this.chatFlow[0].user_input;
  }

  ngOnInit() {
    this.initChatflow();
    this.infoBoxSubscription = this.hideUICommunicationService.hideUIObservable$.subscribe(
      event => {
        if (
          this.infoBoxClickCount === 0 &&
          this.chatFlowList &&
          this.showedInfoIndex > -1
        ) {
          const Info_boxes = this.chatFlowList.nativeElement.getElementsByClassName(
            "info-text"
          );
          for (const box of Info_boxes) {
            if (box !== event.target && !box.contains(event.target)) {
              this.hideInfoBox();
            }
          }
        } else {
          this.infoBoxClickCount = 0;
        }
      }
    );
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
