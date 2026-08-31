# အကြံပြုချက်များ၊ နည်းစနစ်များနှင့် အဖြစ်များသော အမှားများ (Tips, Tricks & Best Practices)

ဒီဆောင်းပါးမှာတော့ Angular project တွေ ရေးသားတဲ့အခါ အစပြုသူတွေ မကြာခဏ ကြုံတွေ့ရတတ်တဲ့ အမှားတွေ၊ အချိန်ကုန်သက်သာစေမယ့် နည်းစနစ်တွေနဲ့ လိုက်နာသင့်တဲ့ အလေ့အကျင့်ကောင်းတွေကို စုစည်းဖော်ပြပေးထားပါတယ်။

---

## ၁။ ပြဿနာဖြစ်ရခြင်း၏ မူလဇာစ်မြစ် (Root Cause) ကို အရင် ရှာဖွေပါ

တစ်ခုခု အလုပ်မလုပ်တော့တာနဲ့ Framework ပျက်နေတာလို့ ချက်ချင်း မတွေးပါနဲ့။ အဖြစ်အများဆုံး အမှားအများစုဟာ အောက်ပါ အချက်တွေကြောင့် ဖြစ်လေ့ရှိပါတယ် -

- **Missing Import** — Standalone Component တွင် အသုံးပြုထားသော Material Component/Directive/Pipe ကို `imports: []` ထဲ ထည့်သွင်းရန် ကျန်ခဲ့ခြင်း
- **CSS Selector Mismatch** — CSS တွင် `html.dark-mode` ဟု ပေးထားပြီး TypeScript မှ `body` ကို toggle လုပ်နေခြင်း
- **Route Path Lွဲမှားခြင်း** — Parameterized route (`:id`) နှင့် Static route (`new`) အစီအစဉ် မှားယွင်းခြင်း
- **State Mutation Error** — Signal တန်ဖိုးကို တိုက်ရိုက် ပြင်ဆင်ရန် ကြိုးစားခြင်း (သို့မဟုတ် Reactive flow မမှန်ခြင်း)

---

## ၂။ Angular Compiler Error Message များကို သေချာ ဖတ်ရှုပါ

Angular ရဲ့ Compiler နှင့် TypeScript Language Server က ထုတ်ပေးတဲ့ Error Messages တွေဟာ အလွန်တိကျပြီး ရှင်းလင်းပါတယ်။

- `NG0300 / NG0301` — Missing component import သို့မဟုတ် Directive မသိရှိခြင်း
- `Cannot find name 'X'` — Typo သို့မဟုတ် Import မပါရှိခြင်း
- `Type 'X' is not assignable to type 'Y'` — Model/Type မကိုက်ညီခြင်း

Error ပေါ်လာတဲ့အခါ ပထမဆုံး စာကြောင်း (First few lines) နဲ့ File Path / Line Number ကို အရင်ဆုံး သေချာကြည့်ပြီး ဖြေရှင်းပါ။

---

## ٣။ Component များကို သေးငယ်ပြီး တာဝန်တစ်ခုတည်း ဦးစားပေးစေပါ (Single Responsibility)

Beginner များ အများဆုံး လုပ်မိတတ်တာက Component တစ်ခုတည်းထဲမှာ Data ဖမ်းတာ၊ Form ကိုင်တာ၊ Business Logic စစ်တာ၊ UI ဆွဲတာ အားလုံးကို စုပြုံရေးသားတတ်ကြခြင်း ဖြစ်ပါတယ်။

**ပိုမိုကောင်းမွန်သော ဖွဲ့စည်းပုံ:**
- **Layout Component** — App Shell, Header, Sidebar
- **List Component** — Items စာရင်းကို ပြသပေးခြင်းနှင့် UI Interaction ကိုသာ တာဝန်ယူခြင်း
- **Form Component** — Input ရယူခြင်းနှင့် Validation စစ်ဆေးခြင်း
- **Service** — Backend ဆက်သွယ်ခြင်း၊ Data စီမံခြင်းနှင့် Business Rules

---

## ၄။ Application Data များကို Service ထဲတွင်သာ ထိန်းသိမ်းပါ

Component တစ်ခုထက်ပိုပြီး သိရှိရန် လိုအပ်သော Data များနှင့် Application Level Data များကို Component ထဲတွင် Local Variable အဖြစ် မထားဘဲ `@Injectable({ providedIn: 'root' })` Service ထဲတွင် ထားရှိပါ။

- Issue List များနှင့် Selected Issue Data
- Backend REST API ခေါ်ယူသည့် Methods များ
- Authentication နှင့် User Permissions
- Global Notifications / Toast Messages

---

## ၅။ အဆင့်ဆင့် စနစ်တကျ လေ့လာပါ (Step-by-Step Learning)

ရှုပ်ထွေးသော State Management Libraries (NgRx/NGXS) များကို ချက်ချင်း မသုံးမီ အခြေခံ Concept များကို အရင်ဆုံး ပိုင်နိုင်အောင် လေ့လာပါ -

```txt
1. Component & Template Binding 
   ⬇
2. Signals & Computed State
   ⬇
3. Services & Dependency Injection
   ⬇
4. Router & Route Parameters
   ⬇
5. Reactive Forms & Validation
   ⬇
6. HttpClient & REST API Integration
```

အခြေခံ Data Flow ကို ပိုင်နိုင်သွားပါက အခြားသော Advanced Architecture များကို အလွယ်တကူ သဘောပေါက်လာပါလိမ့်မယ်။

---

## ၆။ Unit Testing များကို စောစီးစွာ ရေးသားစမ်းသပ်ပါ

Feature တစ်ခု ပြီးတိုင်း အခြေခံ Logic တွေကို စမ်းသပ်ပေးမယ့် Unit Test တွေ ရေးသားထားခြင်းဖြင့် နောက်ပိုင်း Refactoring လုပ်သည့်အခါ အလွန် အထောက်အကူပြုပါတယ် -

- Service ထဲတွင် Item အသစ် ထည့်သွင်းခြင်း (`addIssue`) မှန်ကန်မှု ရှိ/မရှိ
- Item အဟောင်းကို ပြင်ဆင်ခြင်း (`updateIssue`) စနစ်တကျ အလုပ်လုပ်/မလုပ်
- Form Validation အလုပ်လုပ်/မလုပ်

---

## ၇။ Route များကို စနစ်တကျ ဒီဇိုင်းဆင်ပါ

URL ဖွဲ့စည်းပုံသည် Application ရဲ့ Information Architecture ကို ဖော်ပြနေရပါမယ် -

```ts
export const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { path: 'issues', component: IssueList },       // စာရင်း
  { path: 'issues/new', component: IssueForm },   // အသစ်ပြုလုပ်ခြင်း
  { path: 'issues/:id', component: IssueForm },   // ရှိပြီးသားကို ပြင်ဆင်ခြင်း
];
```

---

## ၈။ လက်တွေ့ ရေးသားတည်ဆောက်ရင်း လေ့လာပါ (Learn by Building)

Programming ကို စာအုပ်ဖတ်ရုံ၊ ဗီဒီယိုကြည့်ရုံဖြင့် မကျွမ်းကျင်နိုင်ပါ။ အကောင်းဆုံး သင်ယူနည်းလမ်းမှာ -

1. Feature အသေးလေး တစ်ခု စတင်ရေးပါ။
2. Error တက်အောင် ရေးစမ်းကြည့်ပြီး ဘာကြောင့် Error တက်လဲဆိုတာ ရှာဖွေပါ။
3. Root Cause ကို နားလည်အောင် ဖြေရှင်းပါ။
4. နောက်ထပ် Feature တစ်ခုကို ထပ်မံ ချဲ့ထွင်ပါ။

---

## ၉။ အမြဲ လိုက်နာသင့်သည့် အလေ့အကျင့်ကောင်းများ

- Variable နှင့် Function နာမည်များကို အဓိပ္ပာယ် ရှင်းလင်းစွာ ပေးပါ
- Folder ဖွဲ့စည်းပုံကို Feature အလိုက် (သို့မဟုတ် Layer အလိုက်) စနစ်တကျ ထားပါ
- `any` type အသုံးပြုခြင်းကို တတ်နိုင်သမျှ ရှောင်ရှားပြီး Explicit Interfaces များ သတ်မှတ်ပါ
- Modern Angular Syntax (Signals, Native Control Flow `@if/@for`, `inject()`) များကို ဦးစားပေး သုံးပါ
