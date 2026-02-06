import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { CheckCircle2, ShieldCheck, Activity, Users, Clock, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-secondary-900 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/images/Logo-Blanc-avec-texte.png"
              alt="Vitall Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-white hover:text-primary-500 transition-colors"
            >
              Se connecter
            </Link>
            <Button asChild className="hidden bg-primary-500 hover:bg-primary-600 md:inline-flex">
              <Link href="/account-setup">Essayer Gratuitement</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Sections Hero */}
        <section className="bg-secondary-900 text-white pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-white">
                    La solution opérationnelle pour les <span className="text-primary-500">services d&apos;urgence</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl leading-relaxed">
                    Optimisez la gestion de vos ressources humaines, planifiez les interventions et simplifiez le quotidien de vos équipes, du terrain au bureau.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold">
                    <Link href="/account-setup">
                      Démarrer maintenant <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-gray-600 text-secondary-900 bg-white hover:bg-gray-100 hover:text-secondary-900 font-medium">
                    <Link href="/login">Accéder à mon espace</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" /> Sans engagement
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" /> Déploiement rapide
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" /> Support 24/7
                  </div>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl bg-gray-800 border border-gray-700">
                  <Image
                    src="https://images.unsplash.com/photo-1563062067-7700e1d9ae1d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Équipe de pompiers en intervention"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg w-full max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Intervention en cours</p>
                          <p className="text-xs text-gray-200">Équipe Alpha • Secteur Nord • Arrivée 4 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pattern background decoration */}
                <div className="absolute -z-10 -bottom-12 -right-12 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl"></div>
                <div className="absolute -z-10 -top-12 -left-12 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Features */}
        <section className="container mx-auto px-4 py-24 md:px-6">
          <div className="mb-12 text-center space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour <span className="text-primary-500">sauver des vies</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg">
              Une suite complète d&apos;outils conçue spécifiquement pour les réalités du terrain et les exigences administratives des SDIS et services de secours.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-t-4 border-t-primary-500 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary-500 mb-2" />
                <CardTitle className="text-xl text-secondary-900">Planning & Astreintes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Gestion intelligente des plannings de garde, suivi des astreintes en temps réel et remplacement automatisé des effectifs manquants.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary-500 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <Users className="h-12 w-12 text-secondary-500 mb-2" />
                <CardTitle className="text-xl text-secondary-900">Ressources Humaines</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Centralisez les dossiers, gérez les formations obligatoires, signatures électroniques et processus de recrutement dédiés.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary-500 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <ShieldCheck className="h-12 w-12 text-primary-500 mb-2" />
                <CardTitle className="text-xl text-secondary-900">Conformité & Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Assurez la conformité réglementaire de vos équipements et procédures. Traçabilité complète et sécurité des données de santé.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section Confiance / Humanisation */}
        <section className="bg-white py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="order-2 lg:order-1 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1713689824343-77d2f99e19b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

                  alt="Pompier utilisant Vitall sur tablette"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <blockquote className="text-white font-medium text-lg italic border-l-4 border-primary-500 pl-4">
                    &quot;Vitall a transformé notre gestion quotidienne. Moins de papier, plus de temps pour l&apos;opérationnel.&quot;
                  </blockquote>
                  <p className="text-gray-300 mt-2 font-heading font-bold">- Commandant Martin, SDIS 34</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="font-heading text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
                  Pensé par le terrain, <br />pour le terrain.
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Nous savons que chaque seconde compte. C&apos;est pourquoi Vitall est conçu pour être intuitif et robuste, même dans les conditions les plus exigeantes.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Interface adaptée aux tablettes et mobiles durcis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Mode hors-ligne pour les interventions en zone blanche</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Interopérabilité avec vos systèmes existants</span>
                  </li>
                </ul>
                <div className="pt-6">
                  <Button size="lg" className="bg-secondary-900 hover:bg-secondary-800 text-white">
                    Demander une démonstration
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-primary-500 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Prêt à moderniser votre centre de secours ?
            </h2>
            <p className="mx-auto max-w-[600px] text-white/90 text-xl mb-10">
              Rejoignez les structures qui font confiance à Vitall pour leur gestion quotidienne.
            </p>
            <div className="flex flex-col gap-4 justify-center sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-bold border-2 border-white shadow-xl">
                <Link href="/account-setup">Créer un compte organisation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white">
                <Link href="/login">Connexion membre</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 md:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Image
              src="/assets/images/Logo-Blanc-avec-texte.png"
              alt="Vitall Logo"
              width={100}
              height={30}
              className="h-8 w-auto opacity-90"
            />
            <p className="text-sm">
              La solution SaaS dédiée aux héros du quotidien. Simplifiez le complexe pour vous concentrer sur l&apos;essentiel.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary-500">Fonctionnalités</Link></li>
              <li><Link href="#" className="hover:text-primary-500">Tarifs</Link></li>
              <li><Link href="#" className="hover:text-primary-500">Sécurité</Link></li>
              <li><Link href="#" className="hover:text-primary-500">Intégrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary-500">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary-500">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary-500">Support</Link></li>
              <li><Link href="#" className="hover:text-primary-500">État du service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentions-legales" className="hover:text-primary-500">Mentions Légales</Link></li>
              <li><Link href="#" className="hover:text-primary-500">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-primary-500">CGU</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Vitall Solution. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
