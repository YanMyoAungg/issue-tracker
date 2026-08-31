# Project Setup နှင့် လေ့လာမှု မှတ်စုများ

ဒီဆောင်းပါးမှာတော့ Issue Tracker Project ကို စတင်တည်ဆောက်ခဲ့ပုံ၊ ကြုံတွေ့ခဲ့ရတဲ့ စိန်ခေါ်မှုများ၊ ပြင်ဆင်ဖြေရှင်းခဲ့ပုံများနှင့် အသုံးပြုထားသော Architecture ဒီဇိုင်းများကို အသေးစိတ် ရှင်းပြပေးသွားပါမယ်။

---

## ၁။ Project စတင်ခြင်း (Initial Setup)

Angular CLI ကို အသုံးပြုပြီး Project Skeleton အသစ်တစ်ခုကို စတင်တည်ဆောက်ခဲ့ပါတယ်။

ကနဦးအခြေအနေမှာ ပါဝင်တဲ့ အချက်အလက်များ -
- Root App Component (`app.component.ts`)
- Angular Router
- Angular Material Component Library
- SSR (Server-Side Rendering) Support

ဒါဟာ အခြေခံ အလုပ်လုပ်နိုင်တဲ့ Project အရိုးအဆောက်အအုံ (Skeleton) ဖြစ်ပြီး၊ စစ်မှန်တဲ့ Issue Tracker feature တွေ မပါဝင်သေးပါဘူး။

---

## ၂။ ပထမဆုံး အပြောင်းအလဲ - App Shell တည်ဆောက်ခြင်း

အပလီကေးရှင်း တစ်ခုလုံးအတွက် ခိုင်မာသော UI အခွံ (App Shell) တစ်ခုကို အရင်ဆုံး တည်ဆောက်ခဲ့ပါတယ် -
- **Top Toolbar** — Application Title၊ Dark Mode Toggle နှင့် အထွေထွေ Actions များ
- **Side Navigation (Sidenav)** — Menu Links များ (Issues List, Create Issue စသည်)
- **Main Content Area & `<router-outlet>`** — လက်ရှိ URL Route အလိုက် Component များ ပေါ်လာမည့် နေရာ

```html
<mat-toolbar>
  <span>Issue Tracker</span>
  <mat-slide-toggle [checked]="darkMode()" (change)="toggleDarkMode()">Dark Mode</mat-slide-toggle>
</mat-toolbar>

<mat-sidenav-container>
  <mat-sidenav mode="side" opened>
    <!-- Navigation Links -->
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

### ဘာကြောင့် App Shell Pattern ကို သုံးသလဲ?
Page တစ်ခုစီတိုင်းမှာ Toolbar တွေ၊ Sidenav တွေ ထပ်ခါထပ်ခါ လိုက်ရေးနေစရာ မလိုတော့ဘဲ တစ်သမတ်တည်းဖြစ်သော Layout (Consistent UX) ကို ရရှိစေပါတယ်။ Page အကူးအပြောင်းမှာလည်း Layout တစ်ခုလုံး ပြန်မဆွဲဘဲ အတွင်းပိုင်း Content သာ ပြောင်းလဲသွားမှာ ဖြစ်ပါတယ်။

---

## ၃။ Dark Mode / Theming စိန်ခေါ်မှုနှင့် မှန်ကန်သော ဖြေရှင်းချက်

Angular Material (M3) Theming စနစ်သည် Root HTML Element (`<html>`) ပေါ်ရှိ CSS Custom Properties (Variables) များကို အခြေခံထားပါတယ်။

### ကြုံတွေ့ခဲ့ရသော ပြဿနာ
ပထမအကြိမ်တွင် Dark mode class ကို `document.body` ပေါ်သို့ toggle လုပ်ခဲ့ပါတယ်။ သို့သော် Angular Material CSS က `html.dark-mode` selector ကို စောင့်ကြည့်နေတာကြောင့် Theme ပြောင်းလဲခြင်း မရှိဘဲ ဖြစ်နေခဲ့ပါတယ်။

```css
/* Angular Material Theme က HTML root ကို မျှော်လင့်ထားခြင်း */
html.dark-mode {
  color-scheme: dark;
  --mat-sys-surface: ...;
}
```

### မှန်ကန်သော ပြင်ဆင်ချက် (The Fix)
Theme toggle logic ကို `document.body` အစား Document Root ဖြစ်သော `document.documentElement` ပေါ်တွင် တိုက်ရိုက် သက်ရောက်စေရန် ပြင်ဆင်ခဲ့ပါတယ် -

```ts
// document.documentElement သည် <html> tag ကို ရည်ညွှန်းပါသည်
document.documentElement.classList.toggle('dark-mode', this.darkMode());
```

### အဓိက ရရှိခဲ့သော သင်ခန်းစာ
- CSS Selector တွင် သတ်မှတ်ထားသော Target Element နှင့် TypeScript DOM Manipulation သည် အတိအကျ ကိုက်ညီရပါမည်။
- Style ပျက်နေလျှင် Angular State မမှန်တာလား၊ သို့မဟုတ် DOM Target Selector လွဲနေတာလားဆိုတာကို Developer Tools (Inspect Elements) ဖြင့် အရင်စစ်ဆေးရပါမယ်။

---

## ၄။ Angular Signal အသုံးပြုခြင်း

Theme State နှင့် Application State စီမံခန့်ခွဲမှုအတွက် Angular Signal ကို အသုံးပြုထားပါတယ် -

```ts
protected darkMode = signal(this.readSavedPreference());

// Toggle ပြုလုပ်ခြင်း
toggleDarkMode(): void {
  this.darkMode.update((current) => !current);
}
```

### Signals အသုံးပြုခြင်း၏ အကျိုးကျေးဇူးများ
- Change Detection ကို အလွန်မြန်ဆန်ပြီး တိကျစေခြင်း
- ရှုပ်ထွေးသော RxJS boilerplate များ မလိုဘဲ State ကို ရှင်းလင်းစွာ စီမံနိုင်ခြင်း
- Template ဘက်တွင် getter ပုံစံ `darkMode()` ဖြင့် တိုက်ရိုက် reactive ချိတ်ဆက်နိုင်ခြင်း

---

## ၅။ Codebase ဖွဲ့စည်းပုံနှင့် Separation of Concerns

Project ကြီးထွားလာတဲ့အခါ ရှုပ်ထွေးမှုမရှိစေရန် အလွှာအလိုက် စနစ်တကျ ခွဲထုတ်ထားပါတယ် -

- **Models (`models/issue.model.ts`)** — Issue Data Structure နှင့် Type Definitions များ
- **Services (`services/issue.service.ts`)** — Shared State နှင့် Data Mutation Logic များ
- **Components (`components/`)** — UI Rendering နှင့် User Interaction ကိုသာ ဦးစားပေးသော မျက်နှာပြင်များ
- **Routes (`app.routes.ts`)** — Screen Navigation ဖွဲ့စည်းပုံ

### အကျိုးကျေးဇူး
UI Component ထဲတွင် Data စီမံခန့်ခွဲမှု Logic များ ရောထွေးမနေတော့ဘဲ Codebase ကို ဖတ်ရှုရလွယ်ကူစေခြင်း၊ ပြင်ဆင်ရလွယ်ကူခြင်းနှင့် Test ရေးရလွယ်ကူခြင်းတို့ကို ရရှိစေပါတယ်။

---

## ၆။ Data Layer အတွက် Service အသုံးပြုခြင်း

Issue အချက်အလက်များသည် Component တစ်ခုတည်း၏ UI သက်သက်မဟုတ်ဘဲ Application တစ်ခုလုံးနှင့် သက်ဆိုင်သော Data ဖြစ်သောကြောင့် `IssueService` ထဲတွင် Signal ဖြင့် ထိန်းသိမ်းထားပါတယ် -

```ts
@Injectable({ providedIn: 'root' })
export class IssueService {
  readonly issues = signal<Issue[]>([]);

  addIssue(issue: Issue): void {
    this.issues.update((current) => [issue, ...current]);
  }

  updateIssue(updatedIssue: Issue): void {
    this.issues.update((current) =>
      current.map((item) => (item.id === updatedIssue.id ? updatedIssue : item))
    );
  }
}
```

ဤသို့ ခွဲထုတ်ထားခြင်းကြောင့် နောင်တွင် REST API သို့မဟုတ် Backend Database နှင့် ချိတ်ဆက်လိုပါက Component ဘက်တွင် အပြောင်းအလဲများစွာ မလုပ်ရဘဲ Service Layer တစ်ခုတည်းမှာသာ API Call များ အလွယ်တကူ ပြောင်းလဲထည့်သွင်းနိုင်မည် ဖြစ်သည်။

---

## ၇။ Material Theme CSS Variables အသုံးပြုပုံ

Hardcoded Color တန်ဖိုးများ (`#ffffff`, `#1e1e1e`) အစား Angular Material ရဲ့ System Variables များကို အသုံးပြုထားပါတယ် -

```css
.issue-card {
  background: var(--mat-sys-surface-container);
  color: var(--mat-sys-on-surface);
  border: 1px solid var(--mat-sys-outline-variant);
}
```

ဒါကြောင့် Light Mode မှ Dark Mode သို့ ပြောင်းလိုက်သည့်အခါ Component ရဲ့ အရောင်များသည် အလိုအလျောက် သဟဇာတဖြစ်စွာ လိုက်ပါပြောင်းလဲသွားပါတယ်။

---

## ၈။ အဓိက ရရှိခဲ့သော နည်းပညာ သင်ခန်းစာများ (Key Takeaways)

1. **App Shell Architecture** — Layout နှင့် Page Content ကို သီးခြားစီ ခွဲထားပါ။
2. **Signals for State** — Local နှင့် Shared Application State များအတွက် Signals ကို ဦးစားပေး သုံးပါ။
3. **Layer Separation** — Logic ကို Component တွင် မစုပြုံစေဘဲ Service သို့ ခွဲထုတ်ပါ။
4. **CSS Target Accuracy** — Theme နှင့် Global Style များ ရေးသားသည့်အခါ Target DOM Element ကို သေချာစစ်ဆေးပါ။
5. **Type Safety** — TypeScript Interfaces များကို ပြည့်စုံစွာ သတ်မှတ်ပြီး Data Flow ကို ရှင်းလင်းအောင် ထိန်းသိမ်းပါ။
