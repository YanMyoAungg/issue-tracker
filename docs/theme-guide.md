# Theme နှင့် Layout လမ်းညွှန် (Theme & Layout Guide)

ဒီလမ်းညွှန်မှာတော့ Angular Material ကို အသုံးပြုပြီး Light/Dark Mode Theming စနစ် တည်ဆောက်ပုံ၊ App Shell Layout ဖွဲ့စည်းပုံနှင့် Theming ရေးသားရာတွင် သတိပြုရမည့် အချက်များကို ရှင်းပြပေးထားပါတယ်။

---

## ၁။ Theme Class သည် Root Element ပေါ်တွင် အဘယ်ကြောင့် ရှိရသလဲ?

Angular Material (M3) Theming စနစ်သည် CSS Custom Properties (Variables) များကို အခြေခံထားပြီး Root HTML Element (`<html>`) ပေါ်တွင် Theme Class သတ်မှတ်ပေးခြင်းဖြင့် အလုပ်လုပ်ပါတယ်။

```css
/* Dark mode ဖြစ်သည့်အခါ */
html.dark-mode {
  color-scheme: dark;
  --mat-sys-surface: #121212;
  --mat-sys-on-surface: #e0e0e0;
}
```

### ဘာကြောင့် `<html>` (Document Root) ကို သုံးသလဲ?
Browser ရဲ့ Native UI Controls တွေ၊ Dialog Modals တွေ၊ Overlay Panels တွေနဲ့ Angular Material ရဲ့ Global Styles တွေ အားလုံးဟာ Document Root ကို အခြေခံပြီး CSS Variable တွေကို အမွေဆက်ခံ (Inherit) ယူကြတာကြောင့် ဖြစ်ပါတယ်။

---

## ၂။ အဖြစ်အများဆုံး အမှားနှင့် သတိပြုရန်

စတင်လေ့လာသူများ အများဆုံး မှားတတ်ကြတာက Dark mode class ကို Root Element (`<html>`) ပေါ်မှာ မထည့်ဘဲ `document.body` ပေါ်မှာ သွားပြီး toggle လုပ်မိတတ်ကြခြင်း ဖြစ်ပါတယ်။

```ts
// ❌ မှားယွင်းသော နည်းလမ်း (Material variables တွေ မပြောင်းလဲနိုင်ပါ)
document.body.classList.toggle('dark-mode', true);

// ✅ မှန်ကန်သော နည်းလမ်း (Document Root ဖြစ်သော <html> ပေါ်တွင် သတ်မှတ်ပါ)
document.documentElement.classList.toggle('dark-mode', true);
```

> **ရွှေစည်းမျဉ်း:** CSS Selector ထဲတွင် ရေးသားထားသော Element (`html.dark-mode`) နှင့် TypeScript Code ထဲတွင် Toggle လုပ်သော Element (`document.documentElement`) သည် အတိအကျ ကိုက်ညီရပါမည်။

---

## ၃။ User Preference ကို `localStorage` တွင် သိမ်းဆည်းခြင်း

User က Dark mode သို့မဟုတ် Light mode ကို ရွေးချယ်ပြီးပါက နောက်တစ်ကြိမ် App ကို ဖွင့်သည့်အခါ မူလရွေးချယ်မှုကို မမေ့သွားစေရန် `localStorage` ထဲတွင် သိမ်းဆည်းထားရပါမယ်။

```ts
const THEME_KEY = 'issue-tracker-theme';

// သိမ်းဆည်းခြင်း
localStorage.setItem(THEME_KEY, this.darkMode() ? 'dark' : 'light');

// ပြန်လည်ဖတ်ယူခြင်း
const savedTheme = localStorage.getItem(THEME_KEY);
```

---

## ၄။ OS / System Dark Mode Preference ကို စစ်ဆေးခြင်း

အကယ်၍ User က App ထဲတွင် Theme ကို တစ်ခါမှ မရွေးချယ်ရသေးပါက၊ ၎င်းတို့ အသုံးပြုနေသော Operating System (Windows/macOS/Linux) ရဲ့ System Theme အတိုင်း အလိုအလျောက် သတ်မှတ်ပေးနိုင်ပါတယ် -

```ts
function getSystemPreference(): boolean {
  return window.matchMedia && 
         window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

၎င်းသည် ပထမဆုံး အကြိမ် ဝင်ရောက်လာသော User များအတွက် အလွန်ကောင်းမွန်သော User Experience (UX) ကို ရရှိစေပါတယ်။

---

## ၅။ App Shell Architecture ၏ အခန်းကဏ္ဍ

App Shell ဆိုတာ App ရဲ့ အခြေခံ Layout ဖွဲ့စည်းပုံ (Toolbar + Sidenav + Content Area) ဖြစ်ပါတယ်။

```html
<div class="app-layout">
  <!-- အမြဲတမ်း ပေါ်နေမည့် Toolbar -->
  <mat-toolbar>...</mat-toolbar>

  <mat-sidenav-container>
    <!-- ဘေးဘက် Menu -->
    <mat-sidenav>...</mat-sidenav>

    <!-- Page Content များ ဝင်လာမည့် နေရာ -->
    <mat-sidenav-content>
      <router-outlet />
    </mat-sidenav-content>
  </mat-sidenav-container>
</div>
```

**အကျိုးကျေးဇူးများ:**
- Route အကူးအပြောင်း ဖြစ်တိုင်း Toolbar နှင့် Sidenav များ ပြန်ဆွဲစရာမလိုဘဲ တည်ငြိမ်စွာ ရှိနေခြင်း
- Screen မျက်နှာပြင် အားလုံးတွင် Theme နှင့် Layout စတိုင် တစ်သမတ်တည်း (Consistent) ဖြစ်နေခြင်း

---

## ၆။ Angular Material System Tokens (CSS Variables)

Hardcoded Color တန်ဖိုးများ ရေးမည့်အစား Angular Material က ထောက်ပံ့ပေးထားသော CSS Variables များကို အသုံးပြုရပါမယ် -

```css
.card {
  color: var(--mat-sys-on-surface);
  background: var(--mat-sys-surface-container);
  border: 1px solid var(--mat-sys-outline-variant);
}

.button-primary {
  background: var(--mat-sys-primary);
  color: var(--mat-sys-on-primary);
}
```

ဤ Variables များသည် Light Mode တွင် သင့်လျော်သော အရောင်ကိုလည်းကောင်း၊ Dark Mode တွင် အမှောင်ဘက်အရောင်ကိုလည်းကောင်း အလိုအလျောက် ပြောင်းလဲပေးနိုင်ပါတယ်။

---

## ၇။ Theming Debugging ပြုလုပ်ရာတွင် စစ်ဆေးရန် အချက်များ

Dark mode toggle မလုပ်ဘဲ ဖြစ်နေလျှင် အောက်ပါ အဆင့်အတိုင်း စစ်ဆေးနိုင်ပါသည် -

1. **Inspect Element ဖွင့်ပါ** — `<html>` tag ပေါ်တွင် `.dark-mode` class တကယ် ကပ်နေ/မကပ်နေ စစ်ပါ။
2. **CSS Selector စစ်ပါ** — CSS ထဲတွင် `html.dark-mode` ဟု ရေးထားသလား သို့မဟုတ် `.dark-mode` လား စစ်ပါ။
3. **Signal State စစ်ပါ** — Toggle နှိပ်သည့်အခါ Signal တန်ဖိုး `true/false` အမှန်တကယ် ပြောင်းလဲနေသလား စစ်ပါ။
4. **CSS Variables စစ်ပါ** — သက်ဆိုင်ရာ Element ပေါ်တွင် `--mat-sys-*` variables များ သက်ရောက်နေသလား စစ်ပါ။
