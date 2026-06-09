import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private san = inject(DomSanitizer);
  private s = (svg: string): SafeHtml => this.san.bypassSecurityTrustHtml(svg);

  mobileMenuOpen = signal(false);
  scrolled = signal(false);
  activeSection = signal('accueil');
  formSent = signal(false);
  formError = signal(false);
  formSubmitted = signal(false);

  contactForm = { name: '', email: '', phone: '', restaurant: '', message: '' };

  icons: Record<string, SafeHtml> = {
    smartphone: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`),
    truck: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`),
    calendar: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`),
    chart: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`),
    bell: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`),
    qrcode: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>`),
    monitor: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`),
    userCheck: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`),
    user: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`),
    mail: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`),
    message: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`),
    globe: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`),
    scan: this.s(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`),
  };

  features = [
    { iconKey: 'smartphone', title: 'Commander sur place', color: '#6366f1', desc: 'Le client scanne le QR code posé sur sa table et passe commande directement depuis son téléphone. Zéro attente, zéro papier.' },
    { iconKey: 'truck', title: 'Commande en livraison', color: '#f59e0b', desc: 'Le client choisit ses plats, indique son quartier et son lieu de livraison. Il peut définir une heure de livraison souhaitée.' },
    { iconKey: 'calendar', title: 'Réservation de table', color: '#10b981', desc: 'Réservez une table en quelques secondes : date, heure, nombre de convives. L\'admin confirme et assigne la table depuis GestResto.' },
    { iconKey: 'chart', title: 'Dashboard GestResto', color: '#3730a3', desc: 'Tableau de bord complet en temps réel : commandes actives, menus, gestion des serveurs, réservations, statistiques et revenus.' },
    { iconKey: 'bell', title: 'Notifications en temps réel', color: '#ec4899', desc: 'Clients et serveurs reçoivent une notification à chaque changement de statut : commande reçue, en préparation, prête ou livrée.' },
    { iconKey: 'qrcode', title: 'QR Code par table', color: '#06b6d4', desc: 'Un QR code unique par table, généré et téléchargeable depuis GestResto. Aucun matériel supplémentaire requis.' },
  ];

  roles = [
    {
      iconKey: 'monitor',
      role: 'Administrateur',
      subtitle: 'Espace web — admin.gestresto.app',
      access: 'Identifiants créés à l\'inscription',
      detail: 'L\'administrateur gère son restaurant depuis GestResto, le tableau de bord web. Il configure les menus, crée les accès serveurs et supervise toute l\'activité en temps réel.',
      points: [
        'Gestion des menus, produits et catégories',
        'Création et gestion des comptes serveurs',
        'Suivi des commandes en temps réel',
        'Génération des QR codes de table',
        'Gestion et confirmation des réservations',
        'Statistiques et historique des revenus',
      ],
      scenarios: [] as { label: string; desc: string }[],
      bg: '#3730a3',
      light: '#eef2ff',
    },
    {
      iconKey: 'userCheck',
      role: 'Serveur',
      subtitle: 'Application mobile RestCom',
      access: 'Identifiants fournis par le restaurant',
      detail: 'Le serveur ne crée pas son propre compte. L\'administrateur lui génère ses accès depuis GestResto. Il se connecte ensuite dans RestCom avec ces identifiants.',
      points: [
        'Compte créé exclusivement par l\'administrateur',
        'Accès limité à son restaurant',
        'Prise en charge et suivi des commandes',
        'Gestion de l\'état des commandes (en préparation, prête...)',
        'Notifications des nouvelles commandes',
        'Suivi des tables et des réservations',
      ],
      scenarios: [] as { label: string; desc: string }[],
      bg: '#d97706',
      light: '#fffbeb',
    },
    {
      iconKey: 'user',
      role: 'Client',
      subtitle: 'Application mobile RestCom',
      access: 'Deux modes d\'accès disponibles',
      detail: 'Le client dispose de deux façons d\'utiliser la plateforme selon son besoin du moment.',
      points: [] as string[],
      scenarios: [
        {
          label: 'Sur place via QR code',
          desc: 'Le client scanne le QR code posé sur sa table. L\'application RestCom s\'ouvre directement sur le menu du restaurant. Il passe commande sans créer de compte.',
        },
        {
          label: 'Via l\'application (avec compte)',
          desc: 'Le client crée son compte librement depuis RestCom. Il accède à toutes les options : commande en livraison, commande sur place avec horaire personnalisé, ou réservation de table.',
        },
      ],
      bg: '#059669',
      light: '#ecfdf5',
    },
  ];

  pricingSingle = [
    {
      name: 'À vie',
      price: '1 500 000',
      period: 'paiement unique',
      maintenance: '50 000 FCFA / an',
      tag: '',
      highlight: false,
      desc: 'Accès permanent à GestResto pour 1 restaurant. La maintenance annuelle couvre les mises à jour et le support.',
    },
    {
      name: 'Annuel',
      price: '300 000',
      period: 'par an',
      maintenance: '50 000 FCFA / an',
      tag: 'Recommandé',
      highlight: true,
      desc: 'Abonnement annuel renouvelable. Maintenance incluse pour assurer la continuité du service.',
    },
    {
      name: 'Mensuel',
      price: '30 000',
      period: 'par mois',
      maintenance: null,
      tag: 'Sans engagement',
      highlight: false,
      desc: 'Abonnement flexible sans engagement de durée. Résiliable à tout moment.',
    },
  ];

  pricingMulti = [
    {
      name: 'À vie',
      reduction: '-30%',
      detail: 'sur le prix cumulé des abonnements',
      example: 'Ex. 2 restaurants : 2 100 000 FCFA',
      maintenance: '75 000 FCFA / an',
      highlight: false,
    },
    {
      name: 'Annuel',
      reduction: '-30%',
      detail: 'sur le prix cumulé des abonnements',
      example: 'Ex. 2 restaurants : 420 000 FCFA / an',
      maintenance: '75 000 FCFA / an',
      highlight: true,
    },
    {
      name: 'Mensuel',
      reduction: '-5 000 FCFA',
      detail: 'de réduction par restaurant / mois',
      example: 'Soit 25 000 FCFA / restaurant / mois',
      maintenance: null,
      highlight: false,
    },
  ];

  screenshots = [
    { src: 'mockups/food1-front.png', label: 'Menu du restaurant' },
    { src: 'mockups/food2-portrait.png', label: 'Passage de commande' },
    { src: 'mockups/food3-portrait.png', label: 'Réservation de table' },
  ];

  contactInfos = [
    { iconKey: 'mail', label: 'Email', value: 'equipe.gestresto@gmail.com', href: null },
    { iconKey: 'message', label: 'WhatsApp', value: '+226 57 08 46 42', href: null },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
    const ids = ['accueil', 'demo', 'fonctionnalites', 'application', 'tarifs', 'captures', 'contact'];
    for (let i = ids.length - 1; i >= 0; i--) {
      const el = document.getElementById(ids[i]);
      if (el && window.scrollY >= el.offsetTop - 120) {
        this.activeSection.set(ids[i]);
        break;
      }
    }
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.mobileMenuOpen.set(false);
  }

  isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  isValidPhone(v: string) {
    return /^[+\d][\d\s\-(). ]{5,}$/.test(v.trim());
  }

  sanitizePhone(e: Event) {
    const el = e.target as HTMLInputElement;
    const clean = el.value.replace(/[^0-9+\s\-(). ]/g, '');
    if (el.value !== clean) { el.value = clean; this.contactForm.phone = clean; }
  }

  submitForm() {
    this.formSubmitted.set(true);
    const { name, email, phone, restaurant, message } = this.contactForm;
    const emailFilled = email.trim().length > 0;
    const phoneFilled = phone.trim().length > 0;
    if (!name.trim() || !message.trim()) return;
    if (!emailFilled && !phoneFilled) return;
    if (emailFilled && !this.isValidEmail(email)) return;
    if (phoneFilled && !this.isValidPhone(phone)) return;
    this.formError.set(false);

    const body = new URLSearchParams({
      'form-name': 'contact',
      'bot-field': '',
      name, email, phone, restaurant, message,
    }).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
      .then(() => this.formSent.set(true))
      .catch(() => this.formError.set(true));
  }
}
