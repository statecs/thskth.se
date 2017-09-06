import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatFlowList') chatFlowList: ElementRef;
  @ViewChild('chatFlowContainer') chatFlowContainer: ElementRef;
  @ViewChild('resonsesContainer') resonsesContainer: ElementRef;
  chatFlow: any[];
  responses: any[];
  user_inputs: any[];

  constructor() {
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
                    message: 'Yes',
                    type: 'user',
                    response:
                      {
                        message: 'Great!',
                        type: 'response',
                      }
                  },
                  {
                    message: 'No',
                    type: 'user',
                    response:
                      {
                        message: 'Sorry!',
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
                    message: 'Yes',
                    type: 'user',
                    response:
                      {
                        message: 'Great!',
                        type: 'response',
                      }
                  },
                  {
                    message: 'No',
                    type: 'user',
                    response:
                      {
                        message: 'Sorry!',
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
                    message: 'Yes',
                    type: 'user',
                    response:
                      {
                        message: 'Great!',
                        type: 'response',
                      }
                  },
                  {
                    message: 'No',
                    type: 'user',
                    response:
                      {
                        message: 'Sorry!',
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
                    message: 'Yes',
                    type: 'user',
                    response:
                      {
                        message: 'Great!',
                        type: 'response',
                      }
                  },
                  {
                    message: 'No',
                    type: 'user',
                    response:
                      {
                        message: 'Sorry!',
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
      self.responses.push({
        message: self.user_inputs[index].response.message,
        type: 'response'
      });
      const user_input = self.user_inputs[index].response.user_input;
      console.log(self.user_inputs[index].response.user_input);
      self.user_inputs = user_input;
    }, 500);
  }

  ngOnInit() {
  }

}
