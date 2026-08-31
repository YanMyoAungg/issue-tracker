# Senior Developer အမြင်ဖြင့် Angular Architecture လေ့လာသုံးသပ်ချက် (Senior Walkthrough)

ဒီဆောင်းပါးမှာတော့ Issue Tracker Project ရဲ့ Code Structure၊ Design Decisions များနှင့် Architectural Patterns များကို **Senior Angular Developer** တစ်ဦး၏ အမြင်ဖြင့် စနစ်တကျ သုံးသပ်ရှင်းပြပေးသွားပါမယ်။

Angular ကို အစပြုသူအဆင့်မှ Production-grade Developer အဆင့်သို့ တက်လှမ်းလိုပါက Code အလုပ်လုပ်ရုံ သက်သက်သာမကဘဲ Maintainability (ထိန်းသိမ်းရလွယ်ကူမှု)၊ Scalability (တိုးချဲ့ရလွယ်ကူမှု) နှင့် Clean Code Principles များကို နားလည်သဘောပေါက်ရန် အလွန် အရေးကြီးပါတယ်။

---

## ၁။ App Shell Layout အပေါ် Senior Developer တစ်ဦး၏ အမြင်

Senior Dev တစ်ဦးသည် Application တစ်ခုကို စတင်တည်ဆောက်သည့်အခါ Global Layout နှင့် Feature Content များကို ချက်ချင်း ခွဲခြားမြင်တတ်ပါတယ် -

- **App Shell** ဆိုတာ ဘယ် Page ကိုပဲသွားသွား အမြဲရှိနေမယ့် Navigation Frame (Toolbar + Sidenav) ဖြစ်ပါတယ်။
- Page တစ်ခုချင်းစီ၏ Content များကို App Shell ၏ `<router-outlet />` နေရာတွင်သာ အစားထိုး ပြောင်းလဲစေပါတယ်။

```html
<mat-toolbar color="primary">
  <span>Issue Tracker</span>
  <mat-slide-toggle [checked]="darkMode()" (change)="toggleDarkMode()">Dark Mode</mat-slide-toggle>
</mat-toolbar>

<mat-sidenav-container>
  <mat-sidenav mode="side" opened>
    <a mat-button routerLink="/issues" routerLinkActive="active-link">All Issues</a>
    <a mat-button routerLink="/issues/new" routerLinkActive="active-link">New Issue</a>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

> **Design Decision:** Layout ကို Component တစ်ခုချင်းစီထဲ လိုက်မထည့်ဘဲ Root Shell အဖြစ် ထားရှိခြင်းကြောင့် Page အကူးအပြောင်းတိုင်း Frame တစ်ခုလုံး Re-render ဖြစ်ခြင်းမှ ကာကွယ်ပေးပြီး ချောမွေ့သော UX ကို ရရှိစေပါတယ်။

---

## ၂။ Route Structure နှင့် Information Architecture

Routes ဖွဲ့စည်းပုံသည် Application ၏ လုပ်ဆောင်ချက်များကို ရှင်းလင်းစွာ ထင်ဟပ်စေရပါမည် -

```ts
export const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { path: 'issues', component: IssueList },       // List Screen
  { path: 'issues/new', component: IssueForm },   // Create Flow
  { path: 'issues/:id', component: IssueForm },   // Edit Flow
];
```

Senior Developer သည် URL Route များကို Screen သို့မဟုတ် Resource Definition အဖြစ် ရှုမြင်ပြီး၊ Parameterized Route (`:id`) နှင့် Static Route (`new`) တို့၏ အစီအစဉ်ကို မှန်ကန်စွာ စီစဉ်လေ့ရှိပါတယ်။

---

## ၃။ Signals အခြေပြု State Management

Angular 17+ တွင် Signals သည် အကောင်းဆုံး Reactive State Management အခြေခံ ဖြစ်လာပါတယ်။

```ts
// Service Layer တွင် Application State ကို ထိန်းသိမ်းခြင်း
readonly issues = signal<Issue[]>([]);
```

### Senior Mindset:
- State သည် Application ၏ Data အမှန်ဖြစ်ပြီး UI သည် ထို State ၏ ပုံရိပ် (Reflection) သာ ဖြစ်သည်။
- Signal ကို အသုံးပြုခြင်းဖြင့် မလိုအပ်သော Zone.js Overheads များကို လျှော့ချနိုင်ပြီး အပြောင်းအလဲဖြစ်သည့် နေရာကိုသာ တိတိကျကျ Update လုပ်ပေးနိုင်သည်။

---

## ၄။ Service Layer နှင့် Separation of Concerns

Component နှင့် Service ၏ တာဝန်များကို ရှင်းလင်းစွာ ပိုင်းခြားထားရပါမည် -

- **Component (View Layer):** Template Render လုပ်ခြင်း၊ Form Input ရယူခြင်း၊ Button Click ကဲ့သို့ User Event များကို ဖမ်းယူခြင်း။
- **Service (Data / Business Layer):** Application State ထိန်းသိမ်းခြင်း၊ Data Mutation (Add/Update/Delete) ပြုလုပ်ခြင်း၊ Backend API ခေါ်ယူခြင်း။

```ts
@Injectable({ providedIn: 'root' })
export class IssueService {
  private readonly issuesSignal = signal<Issue[]>([]);
  readonly issues = this.issuesSignal.asReadonly();

  addIssue(issue: Omit<Issue, 'id' | 'createdAt'>): void {
    const newIssue: Issue = {
      ...issue,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.issuesSignal.update((current) => [newIssue, ...current]);
  }

  updateIssue(updated: Issue): void {
    this.issuesSignal.update((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
  }
}
```

> **အားသာချက်:** UI ဒီဇိုင်း ပြောင်းလဲသွားသော်လည်း Core Business Logic များကို ပြန်လည် ထိခိုက်မှု မရှိစေဘဲ သီးခြား စမ်းသပ် (Unit Test) နိုင်ပါတယ်။

---

## ၅။ Form Component ကို Create နှင့် Edit နှစ်မျိုးလုံးအတွက် ပေါင်းစပ်အသုံးပြုခြင်း

Create Form နှင့် Edit Form အတွက် Component နှစ်ခု သီးခြားဆောက်မည့်အစား၊ တူညီသော Form Structure ကို `isEditing` state ဖြင့် ပေါင်းစပ်အသုံးပြုထားပါတယ် -

```ts
export class IssueForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly issueService = inject(IssueService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly isEditing = signal(false);
  private currentId: number | null = null;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    status: ['open' as IssueStatus, Validators.required],
    priority: ['medium' as IssuePriority, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.currentId = Number(idParam);
      this.isEditing.set(true);
      this.loadIssue(this.currentId);
    }
  }

  private loadIssue(id: number): void {
    const issue = this.issueService.getIssueById(id);
    if (issue) {
      this.form.patchValue(issue);
    } else {
      this.router.navigate(['/issues']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (this.isEditing() && this.currentId !== null) {
      this.issueService.updateIssue({ ...payload, id: this.currentId, createdAt: '' });
    } else {
      this.issueService.addIssue(payload);
    }

    this.router.navigate(['/issues']);
  }
}
```

### အကျိုးကျေးဇူး
- Form Controls နှင့် Validation Rules များကို Duplicate မဖြစ်စေခြင်း
- Codebase ကို ကျစ်လျစ် သပ်ရပ်စေပြီး Maintain လုပ်ရ လွယ်ကူစေခြင်း

---

## ၆။ Reactive Forms နှင့် Form Validation စနစ်

Template-driven Forms (`[(ngModel)]`) များထက် Reactive Forms ကို ဦးစားပေး အသုံးပြုရသည့် အကြောင်းရင်းမှာ -
- TypeScript Class ထဲတွင် Form Control များနှင့် Validation Rules များကို တိုက်ရိုက် စီမံနိုင်ခြင်း
- Schema-based Validation နှင့် Custom Validators ရေးသားရ လွယ်ကူခြင်း
- Type-safe Form Values (`getRawValue()`) ရရှိနိုင်ခြင်း

---

## ၇။ CSS Variables (Tokens) ဖြင့် Theming ပြုလုပ်ခြင်း

Hardcoded အရောင်များအစား Angular Material ၏ System Tokens များကို အသုံးပြုထားပါတယ် -

```css
.issue-card {
  background: var(--mat-sys-surface-container);
  color: var(--mat-sys-on-surface);
  border: 1px solid var(--mat-sys-outline-variant);
}
```

၎င်းသည် System Light/Dark Theme ပြောင်းလဲမှုနှင့် အလိုအလျောက် သဟဇာတဖြစ်စေပြီး Design System အဆင့်မီ UI ကို ဖန်တီးပေးပါတယ်။

---

## ၈။ Beginner နှင့် Senior Developer တို့၏ Mindset ကွာခြားချက်

| အချက်အလက် | Beginner Mindset | Senior Developer Mindset |
| :--- | :--- | :--- |
| **ပန်းတိုင်** | Code အလုပ်လုပ်သွားရင် ပြီးပြီ | Code သည် ဖတ်ရှုရလွယ်ကူပြီး Maintain လုပ်ရလွယ်ရမည် |
| **Data Flow** | Component ထဲတွင် Local Variable ဖြင့် Data သိမ်းသည် | Service Layer တွင် Signals/Observables ဖြင့် စနစ်တကျ စီမံသည် |
| **Form Management** | Validation မပါဘဲ Submit ချက်ချင်းလုပ်သည် | Strict Validation, Dirty/Touched States နှင့် Error Guardrails ထည့်သွင်းသည် |
| **Theming** | JavaScript ဖြင့် Style များကို တိုက်ရိုက် Override လုပ်သည် | CSS Custom Properties နှင့် Root Class Toggle စနစ်ကို အသုံးပြုသည် |
| **Architecture** | Component တစ်ခုတည်းတွင် အရာအားလုံး ရောရေးသည် | Layer အလိုက် ခွဲခြားသည် (Model, Service, Component, Route) |

---

## ၉။ နောက်တစ်ဆင့် သွားရမည့် လမ်းပြမြေပုံ (Next Steps)

ယခု အဆင့်တွင် App ၏ အခြေခံ CRUD Workflow နှင့် Architecture သည် ခိုင်မာစွာ ပြီးမြောက်သွားပြီ ဖြစ်ပါတယ်။ နောက်တစ်ဆင့် အနေဖြင့် အောက်ပါတို့ကို ဆက်လက် လေ့လာတိုးချဲ့နိုင်ပါသည် -

1. **HttpClient & REST API Integration** — Backend Server (Node.js/Go/Java) နှင့် ဆက်သွယ်ခြင်း
2. **Asynchronous Handling** — Loading Spinners, Skeleton Screens နှင့် Error Banners များ ထည့်သွင်းခြင်း
3. **Filtering & Pagination** — Status/Priority အလိုက် Issue များကို Filter နှင့် Search ပြုလုပ်ခြင်း
4. **Authentication & Route Guards** — User Login စနစ်နှင့် Protected Routes များ တည်ဆောက်ခြင်း
