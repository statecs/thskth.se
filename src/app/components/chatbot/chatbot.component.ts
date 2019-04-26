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
              en: "Where is KarX located?",
              sv: "Var ligger KårX?"
            },
            type: "user",
            response: {
              message: {
                en: "It is located in Nymble.",
                sv: "Det ligger i Nymble. "
              },
              info: null,
              type: "response",
              user_input: [
                {
                  message: {
                    en: this.messages.three.en,
                    sv: this.messages.three.sv
                  },
                  type: "user",
                  response: {
                    message: {
                      en: this.messages.one.en,
                      sv: this.messages.one.sv
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
                      en: this.messages.two.en,
                      sv: this.messages.two.sv
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
              en: "I want to become a member",
              sv: "Jag vill bli medlem"
            },
            type: "user",
            response: {
              message: {
                en:
                  "Great! Have you registered for this semester? You can do it <a href='https://www.student.ladok.se/student/#/installningar'>here</a>",
                sv:
                  "Bra! Har du kursregistrerat dig? Du kan göra det här: <a href='https://www.student.ladok.se/student/#/installningar'>här</a>"
              },
              info: null,
              type: "response",
              user_input: [
                {
                  message: {
                    en: this.messages.three.en,
                    sv: this.messages.three.sv
                  },
                  type: "user",
                  response: {
                    message: {
                      en:
                        "Have you paid the membership fee? You can do it <a href='https://thskth.se/login'>here</a>",
                      sv:
                        "Har du betalat medlemsavgiften? Vi tar emot Swish eller kort. Du kan logga in <a href='https://thskth.se/login'>här</a>"
                    },
                    info: null,
                    type: "response",
                    user_input: [
                      {
                        message: {
                          en: this.messages.three.en,
                          sv: this.messages.three.sv
                        },
                        type: "user",
                        response: {
                          message: {
                            en:
                              "Have you updated your kth-email at SSSB? You can do it <a href='https://www.sssb.se/en/my-pages/my-contact-details'>here</a>",
                            sv:
                              "Använder du din kth-adress hos SSSB? Detta är ett krav för att systemen ska kunna synkronisera korrekt. Du kan göra det <a href='https://www.sssb.se/en/my-pages/my-contact-details'>här</a>"
                          },
                          info: null,
                          type: "response",
                          user_input: [
                            {
                              message: {
                                en: this.messages.three.en,
                                sv: this.messages.three.sv
                              },
                              type: "user",
                              response: {
                                message: {
                                  en:
                                    "Perfect, within a few days, SSSB will get information about you and you can collect more queue days! Good luck!",
                                  sv:
                                    "Perfekt, Inom några dagar så kommer SSSB få information om dig och du kan samla fler ködagar! Lycka till!"
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
                                  en: this.messages.two.en,
                                  sv: this.messages.two.sv
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
                            en: this.messages.two.en,
                            sv: this.messages.two.sv
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
                      en: this.messages.two.en,
                      sv: this.messages.two.sv
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
