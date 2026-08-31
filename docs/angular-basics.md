# Angular အခြေခံ သဘောတရားများ (Core Concepts)

ဒီအပိုင်းမှာတော့ ဒီ project ကို လက်တွေ့ရေးသားရာမှာ အသုံးပြုခဲ့တဲ့ Angular ရဲ့ အခြေခံ သဘောတရားတွေကို ရိုးရှင်းပြီး နားလည်လွယ်တဲ့ စကားပြော/စာရေးဟန်နဲ့ ရှင်းပြပေးထားပါတယ်။

---

## ၁။ Component ဆိုတာ ဘာလဲ?

Component ဆိုတာ UI ရဲ့ အစိတ်အပိုင်း အပိုင်းအစလေး (Building Block) တစ်ခု ဖြစ်ပါတယ်။ 

ဥပမာအားဖြင့် -
- App Shell (အပေါ်ဘားနှင့် ဘေးဘက် menu ပါဝင်သော အခွံ)
- Issue List (ပြဿနာစာရင်း ပြသသည့် နေရာ)
- Issue Form (အချက်အလက် ဖြည့်သွင်း/ပြင်ဆင်သည့် form)

Angular မှာ Component တစ်ခုကို အောက်ပါ အစိတ်အပိုင်း ၃ မျိုးနဲ့ ဖွဲ့စည်းထားလေ့ရှိပါတယ် -
1. **TypeScript Class** — Logic နှင့် State များကို စီမံခန့်ခွဲသည့် နေရာ
2. **HTML Template** — Screen ပေါ်မှာ ပေါ်လာမယ့် UI ဖွဲ့စည်းပုံ
3. **CSS / SCSS** — Component အတွက် သီးသန့် styling

```ts
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.css',
})
export class IssueList {}
```

> **နားလည်ရလွယ်အောင် ပြောရရင်:** Component ဆိုတာ ကိုယ်ပိုင် Data/State နဲ့ UI ကို တာဝန်ယူပြီး မျက်နှာပြင်ပေါ် render လုပ်ပေးတဲ့ သီးခြား UI Widget တစ်ခု ဖြစ်ပါတယ်။

---

## ၂။ Standalone Component ဆိုတာ ဘာလဲ?

Angular ဗားရှင်းအသစ်များ (v17+) မှာ Standalone Component ကို default အဖြစ် အသုံးပြုပါတယ်။

အရင်တုန်းကလို `NgModule` တွေ ရှုပ်ရှုပ်ထွေးထွေး ကြေညာစရာမလိုတော့ဘဲ Component တစ်ခုချင်းစီမှာ လိုအပ်တဲ့ Directive, Pipe, ဒါမှမဟုတ် အခြား Component တွေကို `imports` array ထဲမှာ တိုက်ရိုက် import လုပ်ပြီး သုံးနိုင်ပါတယ်။

```ts
@Component({
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
})
export class IssueFormComponent {}
```

### ဘာကြောင့် ပိုကောင်းသလဲ?
- မလိုအပ်တဲ့ boilerplate ကုဒ်တွေ နည်းသွားတယ်
- Component တစ်ခုချင်းစီက ဘာ dependency တွေ သုံးထားလဲဆိုတာ ချက်ချင်းသိနိုင်ပြီး နားလည်ရ လွယ်ကူစေတယ်
- Lazy loading လုပ်ရတာ ပိုမိုမြန်ဆန်ပြီး သပ်ရပ်တယ်

---

## ၃။ Signal ဆိုတာ ဘာလဲ?

Signal ဆိုတာ Angular ရဲ့ ခေတ်မီ Reactive State Management စနစ် ဖြစ်ပါတယ်။ ၎င်းသည် တန်ဖိုး (Value) တစ်ခုကို သိမ်းဆည်းထားပြီး၊ အဲ့ဒီတန်ဖိုး ပြောင်းလဲသွားတာနဲ့ အဲ့ဒီ Signal ကို အသုံးပြုနေတဲ့ UI နေရာတွေကို Angular က အလိုအလျောက် ချက်ချင်း update လုပ်ပေးပါတယ်။

```ts
protected darkMode = signal(false);

// တန်ဖိုးကို ဖတ်လိုလျှင် getter အနေဖြင့် ခေါ်သုံးပါ
console.log(this.darkMode()); // false

// တန်ဖိုး အသစ်ပြောင်းလဲလိုလျှင်
this.darkMode.set(true);

// လက်ရှိတန်ဖိုးပေါ် မူတည်ပြီး ပြင်လိုလျှင်
this.darkMode.update(prev => !prev);
```

### ဘယ်လိုနေရာတွေမှာ သုံးသလဲ?
- Theme အခြေအနေ (Light/Dark mode)
- Form Data များနှင့် Input တန်ဖိုးများ
- API ကနေ ရလာတဲ့ Data List များ
- ရွေးချယ်ထားသော Item များ (Selected Item)

---

## ၄။ Effect ဆိုတာ ဘာလဲ?

`effect()` ဆိုတာ Signal တစ်ခု (သို့မဟုတ် တစ်ခုထက်ပိုသော Signal များ) ရဲ့ တန်ဖိုး ပြောင်းလဲသွားတိုင်း အလိုအလျောက် run ပေးတဲ့ function ဖြစ်ပါတယ်။

```ts
effect(() => {
  // darkMode signal ပြောင်းလဲတိုင်း dark-mode class ကို toggle လုပ်မယ်
  document.documentElement.classList.toggle('dark-mode', this.darkMode());
});
```

### ဘာအတွက် အဓိကသုံးသလဲ? (Side Effects)
State တစ်ခု ပြောင်းလဲသွားတဲ့အခါ နောက်ဆက်တွဲ ပြင်ပလုပ်ဆောင်ချက် (Side Effects) တွေ ပြုလုပ်ဖို့ သုံးပါတယ် -
- DOM ပေါ်မှာ Class/Attribute များ သွားရောက် ပြင်ဆင်ခြင်း
- `localStorage` ထဲသို့ Data သိမ်းဆည်းခြင်း
- Analytics Logging များ ပို့ဆောင်ခြင်း

> **သတိပြုရန်:** `effect()` ထဲမှာ Business Logic တွေ၊ Data mutation တွေ အကုန်လိုက်မထည့်သင့်ပါဘူး။ Side effect သီးသန့်အတွက်သာ အသုံးပြုရပါမယ်။

---

## ၅။ Service ဆိုတာ ဘာလဲ?

Service ဆိုတာ Component တွေအချင်းချင်း မျှဝေသုံးစွဲမယ့် Data (Shared State) နဲ့ Business Logic တွေကို သီးခြား ခွဲထုတ်ရေးသားထားတဲ့ TypeScript Class တစ်ခု ဖြစ်ပါတယ်။

```ts
@Injectable({ providedIn: 'root' })
export class IssueService {
  // Shared state logic
}
```

### ဘာကြောင့် Service ကို သုံးသင့်သလဲ?
- Component တွေထဲမှာ Business Logic တွေ ရှုပ်ပွမနေအောင် သီးသန့် ခွဲထုတ်နိုင်တယ် (Separation of Concerns)
- Code duplication မဖြစ်တော့ဘဲ Component အများအပြားကနေ လှမ်းခေါ်သုံးနိုင်တယ်
- Unit Testing ရေးသားရတာ ပိုမို လွယ်ကူစေတယ်

**အဓိက တာဝန်ယူလေ့ရှိသော အချက်များ:**
- Backend API ကနေ Data ခေါ်ယူခြင်း (HTTP Requests)
- Data List များနှင့် အချက်အလက်များ သိမ်းဆည်း/ပြင်ဆင်ခြင်း
- Component များကြား State ချိတ်ဆက်ပေးခြင်း

---

## ၆။ Routing ဆိုတာ ဘာလဲ?

Routing ဆိုတာ Page တစ်ခုကနေ နောက်တစ်ခုကို Browser Refresh မဖြစ်စေဘဲ Client-side မှာ ချောမွေ့စွာ ကူးပြောင်း (Navigate) ပေးတဲ့ စနစ် ဖြစ်ပါတယ်။

```ts
export const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { path: 'issues', component: IssueList },
  { path: 'issues/new', component: IssueForm },
  { path: 'issues/:id', component: IssueForm },
];
```

App ကို Single Page အသွင်မပျက်စေဘဲ URL အလိုက် သက်ဆိုင်ရာ မျက်နှာပြင် (Screen) တွေကို တိတိကျကျ ပြသပေးနိုင်ပါတယ်။

---

## ၇။ Template နှင့် Control Flow

Template ဆိုတာ Angular က Browser ပေါ် Render လုပ်ပေးမယ့် HTML ဖွဲ့စည်းပုံ ဖြစ်ပါတယ်။ Angular v17+ မှာ Native Control Flow Syntax (`@if`, `@for`, `@switch`) တွေကို စတင်အသုံးပြုလာပါတယ်။

```html
<h2>Issue စာရင်း</h2>

@if (issues().length > 0) {
  <ul>
    @for (issue of issues(); track issue.id) {
      <li>{{ issue.title }}</li>
    }
  </ul>
} @else {
  <p>လက်ရှိတွင် Issue မရှိသေးပါ။</p>
}
```

- `@for` မှာ `track` ကို မဖြစ်မနေ ထည့်သွင်းပေးရပြီး Performance ကို သိသိသာသာ ကောင်းမွန်စေပါတယ်။
- Template ထဲကနေ Signal တန်ဖိုးတွေကို `issues()` ဆိုပြီး function call ပုံစံနဲ့ ဖတ်ယူအသုံးပြုပါတယ်။

---

## ၈။ Dependency Injection (DI) ဆိုတာ ဘာလဲ?

Dependency Injection ဆိုတာ Class တစ်ခုက လိုအပ်တဲ့ Object/Service တွေကို ကိုယ်တိုင် `new Service()` ဆိုပြီး ဆောက်မယ့်အစား၊ Angular ရဲ့ DI System ကနေ အလိုအလျောက် ထိုးသွင်း (Inject) ပေးတဲ့ ဒီဇိုင်းပုံစံ ဖြစ်ပါတယ်။

Modern Angular မှာ `inject()` function ကို အသုံးပြုပြီး အလွယ်တကူ ရယူနိုင်ပါတယ် -

```ts
export class IssueList {
  private readonly issueService = inject(IssueService);
  private readonly router = inject(Router);
}
```

၎င်းသည် ကုဒ်ကို ပိုမိုရှင်းလင်းစေပြီး Test ရေးသားတဲ့အခါ Mock Service တွေနဲ့ လဲလှယ်စမ်းသပ်ရ လွယ်ကူစေပါတယ်။

---

## ၉။ Angular Material ဆိုတာ ဘာလဲ?

Angular Material ဆိုတာ Google ရဲ့ Material Design စံနှုန်းတွေနဲ့ တည်ဆောက်ထားတဲ့ တရားဝင် UI Component Library ဖြစ်ပါတယ်။

ဒီ Project မှာ အောက်ပါ Material Component တွေကို အသုံးပြုထားပါတယ် -
- Toolbar (`mat-toolbar`)
- Sidenav (`mat-sidenav`)
- Buttons & Icons (`mat-button`, `mat-icon`)
- Form Fields & Inputs (`mat-form-field`, `mat-input`, `mat-select`)
- Slide Toggle (`mat-slide-toggle`)

UI ကို အချိန်တိုအတွင်း သပ်ရပ်လှပပြီး Modern ကျစေသလို၊ Accessibility (a11y) စံနှုန်းတွေပါ ပြီးပြည့်စုံစွာ ပါဝင်ပြီးသား ဖြစ်ပါတယ်။

---

## ၁၀။ အစပြု လေ့လာသူများအတွက် အကြံပြုချက်

Angular ကို စတင်လေ့လာတဲ့အခါ အရာအားလုံးကို တစ်ပြိုင်နက်တည်း လိုက်မလုပ်ဘဲ အောက်ပါ ဦးစားပေး အစီအစဉ်အတိုင်း တစ်ဆင့်ချင်းစီ သွားသင့်ပါတယ် -

1. **Components & Templates** (UI ဖွဲ့စည်းပုံနှင့် `@if`, `@for` control flow)
2. **Signals** (Local Reactive State စီမံခန့်ခွဲပုံ)
3. **Services & Dependency Injection** (Shared Logic နှင့် Data Layer ခွဲထုတ်ပုံ)
4. **Routing** (URL parameters များနှင့် Page Navigation)
5. **Reactive Forms** (Input handling နှင့် Validation စည်းမျဉ်းများ)
6. **HTTP Client & REST API** (Backend နှင့် ဆက်သွယ်ခြင်း)

ဒီ အဆင့်တွေကို ပိုင်နိုင်သွားပြီဆိုရင် Angular နဲ့ Enterprise-level Application တွေကို ယုံကြည်မှုရှိရှိ ရေးသားနိုင်မှာ ဖြစ်ပါတယ်။
