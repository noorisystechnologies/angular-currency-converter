import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators'
// import { IpapiService } from './ipapi.service';
import { CookieService } from 'ngx-cookie-service';
import { IpapiServiceService } from './ipapi-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'currencyChange';
  userIp ='';
  userCurrency:string;
price: any;
form: FormGroup;
currencyData: any = {};
resultText: string = 'Result appears here';
currencyCodes = Object.keys(this.currencyData);
  constructor(private httpCilent:HttpClient,private ipapiService:IpapiServiceService, private cookieService: CookieService){

  }

  ngOnInit(){
    this.loadUserInfo();
    this.form = new FormGroup({
      amount: new FormControl(null, Validators.required),
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
    });
    this.getSymbols();
    // this.ipapiService.getIpInfo().subscribe(data => {
    //   this.userCurrency = data.currency;
    //   // check if the user has previously selected a currency and update the cookie
    //   if (this.cookieService.check('currency')) {
    //     this.cookieService.set('currency', this.userCurrency);
    //   }
    // });
    // check if the user has previously selected a currency and update the userCurrency variable
  //   if (this.cookieService.check('currency')) {
  //     this.userCurrency = this.cookieService.get('currency');
  //   }
  // }

  // changeCurrency(currency: string) {
  //   // update the user's currency selection and the cookie
  //   this.userCurrency = currency;
  //   this.cookieService.set('currency', currency);
  // }

  }
  
  loadUserInfo(){
    this.httpCilent.get('https://jsonip.com/')
    .pipe(
      switchMap((value:any)=>{
        this.userIp = value.ip;
        let url = `http://api.ipstack.com/${value.ip}?access_key=0e39d3e500a282c0512a09ffbacc0f72`
        return this.httpCilent.get(url)
      })
    ).subscribe((res)=>{
      console.log(res);
      
    },
    (error)=>{
      console.log(error)
    })
    
  }
  getSymbols() {
    let myHeaders: any = new Headers();
    myHeaders.append('apikey', 'hZqc0Gi4IrO3TFroyu46FDIe1Rh2CQgi');

    let requestOptions: any = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      'https://api.apilayer.com/exchangerates_data/latest?symbols=USD%2CEUR%2CJPY%2CGBP%2CNGN&base=USD',
      requestOptions
    )
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('Failed to fetch data');
        }
        return response.text();
      })
      .then((result) => {
        this.currencyData = JSON.parse(result).rates;
        this.currencyCodes = Object.keys(this.currencyData).sort();
        console.log(this.currencyData);
      })
      .catch((err) => console.log(err.message));
  }

  convert(amount: number, from: string, to: string): number {
    let fromConversionCoefficient: number = this.currencyData[from];
    let toConversionCoefficient: number = this.currencyData[to];
    return (toConversionCoefficient / fromConversionCoefficient) * amount;
  }

  onSubmit() {
    if (this.form.valid) {
      let amount: number = parseFloat(this.form.get('amount').value);
      let convertFrom: string = this.form.get('from').value;
      let convertTo: string = this.form.get('to').value;
      let result = this.convert(amount, convertFrom, convertTo);
      result = parseFloat(result.toFixed(2)); // result to 2 decimal places
      this.resultText = `${amount} ${convertFrom} = ${result} ${convertTo}`;
    }
  }

}

