# Issue Tracker သင်ယူမှု လမ်းညွှန်မှတ်စုများ (Learning Notes)

ဒီ `docs` folder ထဲမှာ Issue Tracker Angular project ကို အစအဆုံး လေ့လာတည်ဆောက်ရာမှာ အထောက်အကူပြုမယ့် စာရွက်စာတမ်းတွေနဲ့ မှတ်စုတွေကို စုစည်းဖော်ပြပေးထားပါတယ်။

---

## ဘာအကြောင်းအရာတွေ ပါဝင်သလဲ?

- [setup.md](setup.md) — Project ကို စတင်တည်ဆောက်ပုံ၊ အဆင့်ဆင့် ပြင်ဆင်ဖွဲ့စည်းခဲ့ပုံနှင့် ဗိသုကာဆိုင်ရာ အခြေခံများ
- [angular-basics.md](angular-basics.md) — Angular ရဲ့ အဓိက core concept များကို ရှင်းလင်းလွယ်ကူစွာ ရှင်းပြချက်
- [theme-guide.md](theme-guide.md) — Dark mode၊ Angular Material theme နှင့် CSS variables/selectors အသုံးပြုပုံ လမ်းညွှန်
- [tips-and-tricks.md](tips-and-tricks.md) — အတွေ့ရများသော အမှားများ၊ ရှောင်ရန်/ဆောင်ရန်များနှင့် Debugging လုပ်နည်းများ
- [lesson-02-edit-form.md](lesson-02-edit-form.md) — Issue တစ်ခုကို Edit လုပ်ခြင်း၊ Route Parameter ဖတ်ခြင်းနှင့် Form ပြန်သုံးခြင်း (Reuse) လမ်းညွှန်
- [lesson-03-http-client-rest-api.md](lesson-03-http-client-rest-api.md) — Backend REST API နှင့် HttpClient ချိတ်ဆက်ပုံ၊ Observable/Async Data Flow နှင့် Error Handling အပြည့်အစုံ
- [senior-walkthrough.md](senior-walkthrough.md) — Senior Developer အမြင်ဖြင့် Code Structure၊ Clean Architecture နှင့် Design Decisions များကို လေ့လာသုံးသပ်ချက်

---

## ဖတ်ရှုလေ့လာသင့်သည့် အစီအစဉ်

1. [setup.md](setup.md)
2. [angular-basics.md](angular-basics.md)
3. [theme-guide.md](theme-guide.md)
4. [tips-and-tricks.md](tips-and-tricks.md)
5. [lesson-02-edit-form.md](lesson-02-edit-form.md)
6. [lesson-03-http-client-rest-api.md](lesson-03-http-client-rest-api.md)
7. [senior-walkthrough.md](senior-walkthrough.md)

---

## ဒီ Project ရဲ့ ရည်ရွယ်ချက်

ဒီ project ရဲ့ ရည်ရွယ်ချက်က သီအိုရီသက်သက် စာဖတ်လေ့လာရုံသာမကဘဲ Angular ကို လက်တွေ့ project တစ်ခု တည်ဆောက်ရင်း ထိရောက်စွာ တတ်မြောက်စေဖို့ ဖြစ်ပါတယ်။

Angular CLI ဖြင့် generate လုပ်ထားသော Skeleton ကနေစတင်ပြီး အောက်ပါတို့ကို အဆင့်ဆင့် တည်ဆောက်ထားပါတယ် -

- **App Shell တည်ဆောက်ခြင်း** (Toolbar, Sidenav, Navigation Layout)
- **Theme Support** (Light/Dark Mode Toggle & System Preference)
- **Layer ခွဲခြားခြင်း** (Models, Services, Components)
- **State Management** (Modern Angular Signals)
- **CRUD Workflows** (Issue List, Create, Edit, Delete)
- **Backend Integration** (HttpClient, REST API, Loading & Error States)

Angular အသုံးပြုပြီး Enterprise-grade Web Applications တွေ ရေးသားရာမှာ အသုံးအများဆုံး standard patterns များကို လက်တွေ့ကျကျ လေ့လာသင်ယူနိုင်စေရန် ရည်ရွယ်ပါတယ်။
