# Lesson 02: Issue Edit Form + Route Parameter + Update Data Flow

ဒီ Lesson မှာတော့ Angular App တစ်ခုကို static demo အဆင့်ကနေ လက်တွေ့သုံး Application တစ်ခု ဖြစ်လာစေမယ့် CRUD Update Flow ကို အသေးစိတ် လေ့လာသွားပါမယ်။

---

## သင်ယူရမည့် အဓိက အကြောင်းအရာများ

- Issue တစ်ခုကို Edit ပြုလုပ်ခြင်း
- URL မှ Route Parameter (`:id`) ကို `ActivatedRoute` ဖြင့် ဖတ်ယူခြင်း
- Form Component တစ်ခုတည်းကို Create နှင့် Edit နှစ်မျိုးလုံးအတွက် ပြန်လည်အသုံးပြုခြင်း (Form Reuse)
- Service Layer တွင် State ကို Update ပြုလုပ်ခြင်း
- Save လုပ်ပြီးနောက် List Page သို့ Programmatic Navigation ဖြင့် ပြန်လည်ညွှန်းပို့ခြင်း

---

## ၁။ ဒီ Lesson မှာ ဘာတွေ လုပ်ဆောင်ကြမလဲ?

လက်ရှိအချိန်တွင် ကျွန်ုပ်တို့၏ App မှာ Issue List ကြည့်ခြင်းနှင့် Issue အသစ် Create လုပ်ခြင်းတို့ အလုပ်လုပ်နေပြီ ဖြစ်ပါတယ်။

**ထပ်မံ ဖြည့်စွက်မည့် အဆင့်များ:**
1. List Page ရှိ ကတ်တစ်ခုချင်းစီတွင် "Edit" ခလုတ် ထည့်သွင်းခြင်း
2. Edit ခလုတ်ကို နှိပ်လိုက်ပါက `/issues/:id` route သို့ သွားရောက်ခြင်း
3. Form Component က URL မှ `id` ကို ဖတ်ယူပြီး သက်ဆိုင်ရာ Issue Data ကို Form ထဲသို့ အလိုအလျောက် ဖြည့်သွင်းပေးခြင်း (Prefill)
4. User က အချက်အလက် ပြင်ဆင်ပြီး "Save" နှိပ်သည့်အခါ Service ထဲရှိ Issue ကို Update လုပ်ပေးခြင်း
5. ပြီးဆုံးပါက Issue List သို့ ပြန်လည် ပို့ဆောင်ပေးခြင်း

---

## ၂။ Route Parameter (`:id`) ကို ဘယ်လို ဖတ်ယူမလဲ?

Angular တွင် URL ပေါ်ရှိ dynamic parameter များကို `ActivatedRoute` မှတစ်ဆင့် ရယူနိုင်ပါတယ် -

```ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({ ... })
export class IssueForm implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    // URL မှ 'id' parameter ကို ဖတ်ယူခြင်း
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const issueId = Number(idParam);
      // သက်ဆိုင်ရာ Issue ကို Service ထဲတွင် ရှာဖွေပြီး Form ထဲသို့ ထည့်သွင်းမည်
    }
  }
}
```

> **သတိပြုရန်:** `paramMap.get('id')` မှ ရရှိသော တန်ဖိုးသည် `string` ဖြစ်သောကြောင့် Number ID နှင့် နှိုင်းယှဉ်မည်ဆိုပါက `Number(idParam)` ဖြင့် Type ပြောင်းလဲပေးရပါမယ်။

---

## ၃။ Form တစ်ခုတည်းကို Create နှင့် Edit နှစ်မျိုးလုံးအတွက် ဘယ်လို ပြန်သုံးမလဲ?

Create အတွက် Component တစ်ခု၊ Edit အတွက် Component နောက်တစ်ခု သီးခြားစီ မဆောက်ဘဲ Component တစ်ခုတည်းတွင် `isEditing` state သတ်မှတ်ပြီး ပြန်လည် အသုံးပြုနိုင်ပါတယ် -

```ts
protected readonly isEditing = signal(false);

ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    this.isEditing.set(true);
    this.loadIssueForEdit(Number(idParam));
  }
}

onSubmit(): void {
  if (this.form.invalid) return;

  const formValue = this.form.getRawValue();

  if (this.isEditing()) {
    // Update logic
    this.issueService.updateIssue({ ...formValue, id: this.currentId });
  } else {
    // Create logic
    this.issueService.addIssue(formValue);
  }

  this.router.navigate(['/issues']);
}
```

### ဘာကြောင့် ဒီ Pattern ကို သုံးသလဲ?
- Form Input Fields တွေနဲ့ Validation Logic တွေကို နှစ်ခါ ထပ်ရေးစရာ မလိုတော့ခြင်း
- UI ဒီဇိုင်းနှင့် Form အသွင်အပြင်ကို တစ်နေရာတည်းတွင် စီမံနိုင်ခြင်း

---

## ၄။ Model Structure သတ်မှတ်ခြင်း (`issue.model.ts`)

Type Safety ရရှိစေရန် Issue Interface ကို သေချာ သတ်မှတ်ထားပါသည် -

```ts
export type IssueStatus = 'open' | 'in-progress' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
}
```

---

## ၅။ Service Layer တွင် Update Method ထည့်သွင်းခြင်း

`IssueService` ထဲတွင် Signal ထဲရှိ Issue List မှ သက်ဆိုင်ရာ Item ကို ရှာဖွေပြီး Array အသစ်ဖြင့် Immutable Update လုပ်ပေးရပါမယ် -

```ts
@Injectable({ providedIn: 'root' })
export class IssueService {
  readonly issues = signal<Issue[]>([]);

  getIssueById(id: number): Issue | undefined {
    return this.issues().find((issue) => issue.id === id);
  }

  updateIssue(updatedIssue: Issue): void {
    this.issues.update((currentList) =>
      currentList.map((issue) =>
        issue.id === updatedIssue.id ? { ...issue, ...updatedIssue } : issue
      )
    );
  }
}
```

---

## ၆။ Form Prefill ပြုလုပ်ခြင်း (`patchValue`)

Edit Mode တွင် ရှိပြီးသား Issue ရဲ့ အချက်အလက်များကို Reactive Form ထဲသို့ ထည့်သွင်းရန် `patchValue()` ကို အသုံးပြုပါတယ် -

```ts
private loadIssueForEdit(id: number): void {
  const existing = this.issueService.getIssueById(id);
  if (!existing) {
    // Data မတွေ့ရှိပါက List သို့ ပြန်ပို့မည်
    this.router.navigate(['/issues']);
    return;
  }

  this.form.patchValue({
    title: existing.title,
    description: existing.description,
    status: existing.status,
    priority: existing.priority,
  });
}
```

---

## ၇။ အစပြုသူများ မကြာခဏ မှားတတ်သော အချက်များ

1. **String/Number Type Lွဲမှားခြင်း** — Route param မှ ရသော `"1"` (string) နှင့် Model ရှိ `1` (number) ကို `===` စစ်ဆေးမိ၍ Item ရှာမတွေ့ခြင်း
2. **Item မရှိသည့် အခြေအနေကို Handle မလုပ်ခြင်း** — မရှိသော ID ကို URL တွင် ရိုက်ထည့်သည့်အခါ Form က အလွတ်ကြီး ပေါ်နေခြင်း (Error handling / Redirect ပြုလုပ်သင့်ပါသည်)
3. **Form Submission Logic မှားယွင်းခြင်း** — Edit Mode တွင် `updateIssue` ကို မခေါ်ဘဲ `addIssue` ကို သွားခေါ်မိသဖြင့် Item အသစ် ထပ်တိုးသွားခြင်း

---

## ၈။ အကျဉ်းချုပ် (Summary)

ဒီ Lesson ပြီးမြောက်သွားတဲ့အခါ Route Parameter ဖတ်ယူခြင်း၊ Form တစ်ခုတည်းကို Create/Edit ပေါင်းစပ်အသုံးပြုခြင်းနှင့် State Update လုပ်ဆောင်ချက်များကို ကျွမ်းကျင်စွာ အသုံးချနိုင်မှာ ဖြစ်ပါတယ်။
