# Lesson 03: Angular HTTP Client နှင့် REST API ချိတ်ဆက်ခြင်း

ဒီ Lesson မှာတော့ Angular Frontend Application တစ်ခုကို Backend REST API Server များနှင့် ချိတ်ဆက်ပြီး Production-ready Real-world App တစ်ခုအဖြစ် တည်ဆောက်ပုံကို အသေးစိတ် လေ့လာသွားပါမယ်။

---

## သင်ယူရမည့် အဓိက အကြောင်းအရာများ

- `HttpClient` အသုံးပြုပုံနှင့် `provideHttpClient()` setup ပြုလုပ်ခြင်း
- REST API စံနှုန်းများ (GET, POST, PUT, DELETE)
- API Service Layer ဖွဲ့စည်းပုံနှင့် Separation of Concerns
- RxJS `Observable` သဘောတရားနှင့် Asynchronous Data Stream
- Loading State နှင့် Error Handling စနစ်တကျ ပြုလုပ်ပုံ
- Backend Response များကို TypeScript Model/Interface ဖြင့် Type-safe ချိတ်ဆက်ခြင်း
- CORS (Cross-Origin Resource Sharing) ပြဿနာနှင့် ဖြေရှင်းနည်းများ

---

## ၁။ Real-World Application များတွင် Backend API သည် အဘယ်ကြောင့် လိုအပ်သလဲ?

Frontend သီးသန့် အခြေခံ App များတွင် Data များကို Component သို့မဟုတ် Local Service ထဲရှိ Array တွင် Hardcoded ရေးသားထားလေ့ရှိပါတယ် -

```ts
issues = [
  { id: 1, title: 'Login issue', status: 'open' },
  { id: 2, title: 'UI bug', status: 'closed' },
];
```

ဒါဟာ စမ်းသပ်လေ့လာဖို့အတွက် လွယ်ကူသော်လည်း လက်တွေ့ အသုံးချ Application များတွင် အချက်အလက်များကို Database ထဲတွင် အမြဲတစေ သိမ်းဆည်းရန် Backend Server (REST API) နှင့် ချိတ်ဆက်ရပါမည်။

### Senior Architecture အမြင်
UI Component သည် Backend ဆက်သွယ်မှု Logic ကြီးတစ်ခုလုံးကို တိုက်ရိုက် မလုပ်ဆောင်သင့်ပါ။
- **Component** — UI Display နှင့် User Interaction များကိုသာ တာဝန်ယူရမည်။
- **Service Layer** — Backend API နှင့် ဆက်သွယ်ခြင်း၊ Data ပို့ခြင်း/ယူခြင်းများကိုသာ တာဝန်ယူရမည်။

```txt
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Component   │ ───> │  API Service │ ───> │  HttpClient  │ ───> │ REST Backend │
│ (View / UI)  │      │ (Data Logic) │      │ (HTTP Calls) │      │   (Server)   │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

---

## ၂။ REST API အခြေခံ သဘောတရားများ

REST API ဆိုတာ Frontend နှင့် Backend အချင်းချင်း အချက်အလက် ဖလှယ်ရာတွင် အသုံးပြုသော Standard Architecture တစ်ခု ဖြစ်ပါတယ်။

အသုံးအများဆုံး HTTP Methods များမှာ -
- `GET` — Data များကို ဆာဗာမှ ဖတ်ယူခြင်း (ဥပမာ `GET /api/issues`)
- `POST` — Data အသစ်တစ်ခု ဆာဗာသို့ ပေးပို့ဖန်တီးခြင်း (ဥပမာ `POST /api/issues`)
- `PUT` / `PATCH` — ရှိပြီးသား Data ကို ပြင်ဆင်မွမ်းမံခြင်း (ဥပမာ `PUT /api/issues/1`)
- `DELETE` — Data ကို ဖျက်ပစ်ခြင်း (ဥပမာ `DELETE /api/issues/1`)

---

## ၃။ Angular တွင် `HttpClient` ကို Setup ပြုလုပ်ခြင်း

Angular တွင် HTTP Requests များ ပြုလုပ်နိုင်ရန်အတွက် `app.config.ts` ရှိ Application Providers ထဲတွင် `provideHttpClient()` ကို ထည့်သွင်းပေးရပါမည်။

### `app.config.ts`
```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // 👈 HTTP Client ကို Provide လုပ်ပါ
  ],
};
```

`provideHttpClient()` ထည့်သွင်းပြီးပါက Service များနှင့် Component များထဲတွင် `inject(HttpClient)` ဖြင့် စတင်အသုံးပြုနိုင်ပါပြီ။

---

## ၄။ API Service Layer ရေးသားခြင်း (`issue-api.service.ts`)

API Calls များကို Component များထဲတွင် တိုက်ရိုက်မရေးဘဲ သီးခြား Service အနေဖြင့် စုစည်းရေးသားရပါမည်။

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/issues';

  // Issue အားလုံး ရယူခြင်း
  getIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.baseUrl);
  }

  // ID အလိုက် Issue တစ်ခု ရယူခြင်း
  getIssueById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/${id}`);
  }

  // Issue အသစ် ဖန်တီးခြင်း
  createIssue(payload: Omit<Issue, 'id' | 'createdAt'>): Observable<Issue> {
    return this.http.post<Issue>(this.baseUrl, payload);
  }

  // Issue ပြင်ဆင်ခြင်း
  updateIssue(id: number, payload: Partial<Issue>): Observable<Issue> {
    return this.http.put<Issue>(`${this.baseUrl}/${id}`, payload);
  }

  // Issue ဖျက်ပစ်ခြင်း
  deleteIssue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

---

## ၅။ `Observable` ဆိုတာ ဘာလဲ?

Angular ၏ `HttpClient` သည် ရလဒ်များကို JavaScript Promise အစား RxJS `Observable` အနေဖြင့် ပြန်ပေးပါတယ်။

Observable ဆိုတာ အချိန်ကာလ တစ်ခုအတွင်း ဖြစ်ပေါ်လာမည့် Asynchronous Data Stream တစ်ခု ဖြစ်ပြီး၊ ၎င်းကို အသုံးပြုရန် `subscribe()` ပြုလုပ်ရပါသည် -

```ts
this.apiService.getIssues().subscribe({
  next: (data) => {
    console.log('ဒေတာ ရရှိပါသည်:', data);
  },
  error: (err) => {
    console.error('API ခေါ်ယူမှု မအောင်မြင်ပါ:', err);
  },
  complete: () => {
    console.log('Request ပြီးဆုံးပါပြီ');
  }
});
```

---

## ၆။ Loading State နှင့် Error Handling ကို စနစ်တကျ စီမံခြင်း

လက်တွေ့ အသုံးပြုရာတွင် Network နှေးကွေးခြင်း၊ Server ကျနေခြင်းများ ရှိနိုင်သောကြောင့် User အား Loading Indicator နှင့် Error Message များကို သေချာ ပြသပေးရပါမည်။

### Component Logic
```ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { IssueApiService } from './issue-api.service';
import { Issue } from './issue.model';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
})
export class IssueListComponent implements OnInit {
  private readonly apiService = inject(IssueApiService);

  readonly issues = signal<Issue[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchIssues();
  }

  fetchIssues(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.apiService.getIssues().subscribe({
      next: (data) => {
        this.issues.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching issues:', error);
        this.errorMessage.set('အချက်အလက်များ ရယူ၍ မရနိုင်ပါ။ ခေတ္တစောင့်ဆိုင်းပြီး ထပ်မံကြိုးစားပါ။');
        this.isLoading.set(false);
      },
    });
  }
}
```

### Template (`issue-list.component.html`)
```html
@if (isLoading()) {
  <div class="loading-state">
    <mat-spinner diameter="40"></mat-spinner>
    <p>အချက်အလက်များ ရယူနေပါသည်...</p>
  </div>
} @else if (errorMessage()) {
  <div class="error-banner">
    <p>{{ errorMessage() }}</p>
    <button mat-button (click)="fetchIssues()">ထပ်မံကြိုးစားရန် (Retry)</button>
  </div>
} @else {
  @if (issues().length === 0) {
    <p>လက်ရှိတွင် Issue မရှိသေးပါ။</p>
  } @else {
    <div class="issue-grid">
      @for (issue of issues(); track issue.id) {
        <mat-card class="issue-card">
          <mat-card-header>
            <mat-card-title>{{ issue.title }}</mat-card-title>
            <mat-card-subtitle>Status: {{ issue.status }} | Priority: {{ issue.priority }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ issue.description }}</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  }
}
```

---

## ၇။ CRUD လုပ်ဆောင်ချက်များ ပြုလုပ်ပြီးနောက် UI ကို Update ပြုလုပ်ပုံ

Create, Update သို့မဟုတ် Delete ပြုလုပ်ပြီးပါက Backend Database ထဲတွင် Data ပြောင်းလဲသွားပြီ ဖြစ်သော်လည်း Frontend UI တွင် ချက်ချင်း ထင်ဟပ်စေရန် နည်းလမ်း ၂ မျိုး ရှိပါတယ် -

1. **Re-fetch Method (အလွယ်ကူဆုံးနှင့် အတိကျဆုံး နည်းလမ်း):** Mutation အောင်မြင်ပါက `fetchIssues()` ကို ပြန်လည် ခေါ်ယူခြင်း
2. **Optimistic / Local Update:** Server response မစောင့်ဘဲ (သို့မဟုတ် response ရသည်နှင့်) Frontend Signal ထဲရှိ Array ကို တိုက်ရိုက် update လုပ်ခြင်း

```ts
deleteIssue(id: number): void {
  this.apiService.deleteIssue(id).subscribe({
    next: () => {
      // နည်းလမ်း ၁: Server မှ စာရင်းအသစ် ပြန်ဆွဲခြင်း
      this.fetchIssues();

      // သို့မဟုတ် နည်းလမ်း ၂: Local Signal ထဲမှ ဖယ်ထုတ်ခြင်း
      // this.issues.update(list => list.filter(item => item.id !== id));
    },
    error: (err) => alert('ဖျက်ပစ်၍ မရနိုင်ပါ')
  });
}
```

---

## ၈။ CORS (Cross-Origin Resource Sharing) အမှားကို သတိပြုရန်

Angular Frontend သည် `http://localhost:4200` တွင် run နေပြီး Backend Server သည် `http://localhost:8080` (သို့မဟုတ် အခြား port) တွင် run နေပါက Browser ၏ Same-Origin Policy ကြောင့် CORS Error တက်ရောက်တတ်ပါတယ်။

> **ဖြေရှင်းနည်း:** CORS သည် Frontend မှ ဖြေရှင်းရသော ပြဿနာမဟုတ်ဘဲ **Backend Server** ဘက်တွင် `Access-Control-Allow-Origin: http://localhost:4200` header ကို ထည့်သွင်းခွင့်ပြုပေးရပါမည်။

---

## ၉။ အဓိက မှတ်သားရန် အချက်များ

1. `provideHttpClient()` ကို `app.config.ts` တွင် ထည့်သွင်းရန် မမေ့ပါနှင့်။
2. HTTP Calls များကို Service Layer တွင်သာ ရေးသားပြီး Component များမှ Inject ပြုလုပ်၍ ခေါ်သုံးပါ။
3. Asynchronous Network Calls များအတွက် Loading Indicator နှင့် Error Message များကို အမြဲ ထည့်သွင်းစဉ်းစားပါ။
4. Response Format များကို TypeScript Interface များဖြင့် Type-safe ဖြစ်အောင် ချိတ်ဆက်ပါ။
