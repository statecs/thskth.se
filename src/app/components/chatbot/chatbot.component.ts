import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
//import {forEach} from "@angular/router/src/utils/collection";
import {messages} from '../../utils/chatbot-commonMessages';
import {LoaderMessageComponent} from "../loader-message/loader-message.component";


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
    entryComponents: [LoaderMessageComponent]
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatFlowList') chatFlowList: ElementRef;
  @ViewChild('chatFlowContainer') chatFlowContainer: ElementRef;
  @ViewChild('resonsesContainer') resonsesContainer: ElementRef;
  chatFlow: any[];
  responses: any[];
  user_inputs: any[];
  public messages: any;

  constructor(private resolver: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef) {
      this.messages = messages;
    this.chatFlow = [
      {
        message: 'Hey, Nice to meet you!. What do you want help with?',
        type: 'response',
        user_input: [
          {
            message: 'I would like to get help',
            type: 'user',
            response:
              {
                message: 'Great! Was it helpful?',
                type: 'response',
                user_input: [
                  {
                    message: this.messages.three,
                    type: 'user',
                    response:
                      {
                        message: this.messages.one,
                        type: 'response',
                      }
                  },
                  {
                    message: this.messages.four,
                    type: 'user',
                    response:
                      {
                        message: this.messages.two,
                        type: 'response',
                      }
                  }
                ]
              }
          },
          {
            message: 'Where is KarX located?',
            type: 'user',
            response:
              {
                message: 'It is located in Nymble. Was it helpful?',
                type: 'response',
                user_input: [
                  {
                    message: this.messages.three,
                    type: 'user',
                    response:
                      {
                        message: this.messages.one,
                        type: 'response',
                      }
                  },
                  {
                    message: this.messages.four,
                    type: 'user',
                    response:
                      {
                        message: this.messages.two,
                        type: 'response',
                      }
                  }
                ]
              }
          },
          {
            message: 'I want to become a member',
            type: 'user',
            response:
              {
                message: 'Great! Have you semester registered?',
                type: 'response',
                user_input: [
                  {
                    message: this.messages.three,
                    type: 'user',
                    response:
                      {
                        message: 'Have you paid the membership fee? (365kr)?',
                        type: 'response',
                          user_input: [
                              {
                                  message: this.messages.three,
                                  type: 'user',
                                  response:
                                      {
                                          message: 'Have you checked that you use your kth-adress at SSSB?',
                                          type: 'response',
                                          user_input: [
                                              {
                                                  message: this.messages.three,
                                                  type: 'user',
                                                  response:
                                                      {
                                                          message: 'Perfect! It will take between 2-3 weeks until you get your card! Enjoy!',
                                                          type: 'response',
                                                      }
                                              },
                                              {
                                                  message: this.messages.four,
                                                  type: 'user',
                                                  response:
                                                      {
                                                          message: this.messages.two,
                                                          type: 'response',
                                                      }
                                              }
                                          ]
                                      }
                              },
                              {
                                  message: this.messages.four,
                                  type: 'user',
                                  response:
                                      {
                                          message: this.messages.two,
                                          type: 'response',
                                      }
                              }
                          ]
                      }
                  },
                  {
                    message: this.messages.four,
                    type: 'user',
                    response:
                      {
                        message: this.messages.two,
                        type: 'response',
                      }
                  }
                ]
              }
          },
          {
            message: 'Who should I contact?',
            type: 'user',
            response:
              {
                message: 'THS! Was it helpful?',
                type: 'response',
                user_input: [
                  {
                    message: this.messages.three,
                    type: 'user',
                    response:
                      {
                        message: this.messages.one,
                        type: 'response',
                      }
                  },
                  {
                    message: this.messages.four,
                    type: 'user',
                    response:
                      {
                        message: this.messages.two,
                        type: 'response',
                      }
                  }
                ]
              }
          },
        ]
      }
    ];

    this.responses = [{
      message: this.chatFlow[0].message,
      type: 'response'
    }];
    this.user_inputs = this.chatFlow[0].user_input;
  }

  addItemToChatFlow(event, index) {
    const rect = this.chatFlowList.nativeElement.lastElementChild;
    let top: number;
    let height: number;
    if (rect !== 'undefined') {
      top = rect.offsetTop;
      height = rect.offsetHeight;
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
              type: 'response'
          });
          const user_input = old_user_inputs[index].response.user_input;
          self.user_inputs = user_input;
      }, 1500);
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

  ngOnInit() {
  }

}
