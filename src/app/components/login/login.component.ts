import { Component, OnInit } from "@angular/core";
import { HeaderCommunicationService } from "../../services/component-communicators/header-communication.service";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginTab = LoginTab;
  selectedTab: LoginTab;
  loginForm: FormGroup;
  constructor(private headerCommunicationService: HeaderCommunicationService) {
    this.selectedTab = LoginTab.KTHLogin;
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
  }

  selectTab(tab: LoginTab): void {
    this.selectedTab = tab;
  }

  onSubmit() {
    console.log(this.loginForm.value);
    console.log(this.loginForm.valid);
  }
}

enum LoginTab {
  KTHLogin,
  Password
}
