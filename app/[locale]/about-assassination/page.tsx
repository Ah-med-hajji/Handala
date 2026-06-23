import { getSiteContent, getPublishedAssassinationPdfs } from '@/lib/content';
import { getTranslations } from 'next-intl/server';
import { pickLocaleField } from '@/lib/i18n-utils';
import AboutAssassinationTabs from '@/components/about-assassination/AboutAssassinationTabs';

const DEFAULT_AR = `في الثاني والعشرين من يوليو/تموز 1987، تعرّض ناجي العلي لمحاولة اغتيال في لندن قرب مكتب جريدة "القبس" التي كان يعمل فيها، حيث أُطلقت رصاصة على رأسه. ظلّ في غيبوبة خمسة أسابيع، ثم رحل في التاسع والعشرين من أغسطس/آب من العام نفسه.

اغتيل ناجي العلي لأن ريشته رفضت أن تنحاز إلا لمن هم "تحت"، ولأنه كان يكتب ويرسم بصدقٍ عارٍ، لا يجامل نظاماً ولا فصيلاً ولا قبيلة. اختار حنظلة – الطفل اللاجئ – أن يدير ظهره للعالم، فردّ العالم بطلقةٍ غادرة.

لم يُغلق ملف الاغتيال حتى اليوم. لم يُعرف القاتل علناً، ولم تُكشف الجهة التي خطّطت للجريمة. ما يُعرف أن صوته كان يزعج كثيرين، وأن رصاصةً واحدة لم تستطع أن تُسكته: رسومه ما زالت تُتداول، وحنظلة ما زال هناك، شاهداً صامتاً، ينتظر العودة.`;

const DEFAULT_EN = `On 22 July 1987, Naji Al-Ali was shot in the head outside the London office of Al-Qabas, the Kuwaiti newspaper he worked for. He remained in a coma for five weeks and died on 29 August 1987.

He was assassinated because his pen refused to side with anyone but the dispossessed — those he called the people "underneath". He flattered no regime, no faction, no tribe. His character Handala, the refugee child, turned his back on the world; the world replied with a bullet.

The case has never been publicly resolved. The shooter has not been named, and the parties who planned the killing have never been identified. What is known is that his voice troubled many, and that a single bullet did not silence him: his cartoons are still in circulation, and Handala is still there — a silent witness, waiting for the return.`;

export default async function AboutAssassinationPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [content, pdfs] = await Promise.all([
    getSiteContent('about_assassination'),
    getPublishedAssassinationPdfs(),
  ]);
  const t = await getTranslations({ locale });

  const title =
    pickLocaleField(content, 'title', locale) || t('nav.aboutAssassination');

  const body =
    pickLocaleField(content, 'content', locale) ||
    (locale === 'ar' ? DEFAULT_AR : DEFAULT_EN);

  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <AboutAssassinationTabs
      locale={locale}
      title={title}
      paragraphs={paragraphs}
      pdfs={pdfs}
      labels={{
        articleTab: t('aboutAssassination.tabs.article'),
        documentsTab: t('aboutAssassination.tabs.documents'),
        emptyDocuments: t('aboutAssassination.emptyDocuments'),
        openPdf: t('aboutAssassination.openPdf'),
        untitledPdf: t('aboutAssassination.untitledPdf'),
      }}
    />
  );
}
