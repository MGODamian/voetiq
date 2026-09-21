  "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Translation = {
  createAccount: string;
  subtitle: string;
  firstName: string;
  lastName: string;
  username: string;
  usernamePlaceholder: string;
  usernameHelp: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  agreePrefix: string;
  terms: string;
  agreeMiddle: string;
  privacy: string;
  creating: string;
  create: string;
  alreadyAccount: string;
  login: string;
  fillAll: string;
  acceptTerms: string;
  usernameLength: string;
  usernameCharacters: string;
  passwordLength: string;
  emailExists: string;
  accountFailed: string;
  genericError: string;
  country: string;
  countryPlaceholder: string;
  timezone: string;
  timezonePlaceholder: string;
  region: string;
  regionPlaceholder: string;
  searchCountry: string;
  checkEmail: string;
  confirmationSent: string;
  confirmationInstruction: string;
  goToLogin: string;
};

const ui: Record<LanguageCode, Translation> = {
  nl: {
    createAccount: "Account aanmaken",
    subtitle: "Maak gratis een account en begin met voorspellen.",
    firstName: "Voornaam",
    lastName: "Achternaam",
    username: "Gebruikersnaam",
    usernamePlaceholder: "Kies een gebruikersnaam",
    usernameHelp: "Dit is de naam die andere spelers op VoetIQ zien.",
    email: "E-mailadres",
    emailPlaceholder: "jij@email.nl",
    password: "Wachtwoord",
    passwordPlaceholder: "Minimaal 8 tekens",
    agreePrefix: "Ik ga akkoord met de",
    terms: "Algemene voorwaarden",
    agreeMiddle: "en het",
    privacy: "Privacybeleid",
    creating: "Account aanmaken...",
    create: "Account aanmaken",
    alreadyAccount: "Heb je al een account?",
    login: "Inloggen",
    fillAll: "Vul alle velden in.",
    acceptTerms:
      "Je moet akkoord gaan met de Algemene voorwaarden en het Privacybeleid.",
    usernameLength:
      "Je gebruikersnaam moet minimaal 3 tekens bevatten.",
    usernameCharacters:
      "Je gebruikersnaam mag alleen letters, cijfers en underscores bevatten.",
    passwordLength:
      "Je wachtwoord moet minimaal 8 tekens bevatten.",
    emailExists:
      "Er bestaat al een account met dit e-mailadres.",
    accountFailed: "Account kon niet worden aangemaakt.",
    genericError: "Er ging iets mis. Probeer het opnieuw.",
    country: "Land", countryPlaceholder: "Kies je land", timezone: "Tijdzone", timezonePlaceholder: "Kies je tijdzone", region: "Regio", regionPlaceholder: "Kies je regio", searchCountry: "Zoek een land...",
    checkEmail: "Controleer je e-mail",
    confirmationSent: "We hebben een bevestigingslink gestuurd naar:",
    confirmationInstruction:
      "Klik op de link in de e-mail om je account te bevestigen. Daarna kun je inloggen en beginnen met voorspellen.",
    goToLogin: "Naar inloggen",
  },

  en: {
    createAccount: "Create account",
    subtitle: "Create a free account and start predicting.",
    firstName: "First name",
    lastName: "Last name",
    username: "Username",
    usernamePlaceholder: "Choose a username",
    usernameHelp: "This is the name other players will see on VoetIQ.",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    agreePrefix: "I agree to the",
    terms: "Terms and Conditions",
    agreeMiddle: "and the",
    privacy: "Privacy Policy",
    creating: "Creating account...",
    create: "Create account",
    alreadyAccount: "Already have an account?",
    login: "Log in",
    fillAll: "Please fill in all fields.",
    acceptTerms:
      "You must agree to the Terms and Conditions and Privacy Policy.",
    usernameLength:
      "Your username must contain at least 3 characters.",
    usernameCharacters:
      "Your username may only contain letters, numbers and underscores.",
    passwordLength:
      "Your password must contain at least 8 characters.",
    emailExists:
      "An account with this email address already exists.",
    accountFailed: "The account could not be created.",
    genericError: "Something went wrong. Please try again.",
    country: "Country", countryPlaceholder: "Choose your country", timezone: "Time zone", timezonePlaceholder: "Choose your time zone", region: "Region", regionPlaceholder: "Choose your region", searchCountry: "Search country...",
    checkEmail: "Check your email",
    confirmationSent: "We sent a confirmation link to:",
    confirmationInstruction:
      "Click the link in the email to confirm your account. You can then log in and start making predictions.",
    goToLogin: "Go to login",
  },

  de: {
    createAccount: "Konto erstellen",
    subtitle: "Erstelle kostenlos ein Konto und beginne mit dem Tippen.",
    firstName: "Vorname",
    lastName: "Nachname",
    username: "Benutzername",
    usernamePlaceholder: "Wähle einen Benutzernamen",
    usernameHelp:
      "Diesen Namen sehen andere Spieler auf VoetIQ.",
    email: "E-Mail-Adresse",
    emailPlaceholder: "du@email.de",
    password: "Passwort",
    passwordPlaceholder: "Mindestens 8 Zeichen",
    agreePrefix: "Ich stimme den",
    terms: "Allgemeinen Geschäftsbedingungen",
    agreeMiddle: "und der",
    privacy: "Datenschutzerklärung",
    creating: "Konto wird erstellt...",
    create: "Konto erstellen",
    alreadyAccount: "Du hast bereits ein Konto?",
    login: "Anmelden",
    fillAll: "Fülle alle Felder aus.",
    acceptTerms:
      "Du musst den Allgemeinen Geschäftsbedingungen und der Datenschutzerklärung zustimmen.",
    usernameLength:
      "Dein Benutzername muss mindestens 3 Zeichen enthalten.",
    usernameCharacters:
      "Dein Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten.",
    passwordLength:
      "Dein Passwort muss mindestens 8 Zeichen enthalten.",
    emailExists:
      "Es existiert bereits ein Konto mit dieser E-Mail-Adresse.",
    accountFailed: "Das Konto konnte nicht erstellt werden.",
    genericError:
      "Etwas ist schiefgelaufen. Versuche es erneut.",
    country: "Land", countryPlaceholder: "Land auswählen", timezone: "Zeitzone", timezonePlaceholder: "Zeitzone auswählen", region: "Region", regionPlaceholder: "Region auswählen", searchCountry: "Land suchen...",
    checkEmail: "Überprüfe deine E-Mails",
    confirmationSent:
      "Wir haben einen Bestätigungslink gesendet an:",
    confirmationInstruction:
      "Klicke auf den Link in der E-Mail, um dein Konto zu bestätigen. Danach kannst du dich anmelden und mit dem Tippen beginnen.",
    goToLogin: "Zur Anmeldung",
  },

  es: {
    createAccount: "Crear cuenta",
    subtitle:
      "Crea una cuenta gratis y empieza a hacer pronósticos.",
    firstName: "Nombre",
    lastName: "Apellido",
    username: "Nombre de usuario",
    usernamePlaceholder: "Elige un nombre de usuario",
    usernameHelp:
      "Este es el nombre que verán los demás jugadores en VoetIQ.",
    email: "Correo electrónico",
    emailPlaceholder: "tu@email.es",
    password: "Contraseña",
    passwordPlaceholder: "Mínimo 8 caracteres",
    agreePrefix: "Acepto los",
    terms: "Términos y condiciones",
    agreeMiddle: "y la",
    privacy: "Política de privacidad",
    creating: "Creando cuenta...",
    create: "Crear cuenta",
    alreadyAccount: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    fillAll: "Completa todos los campos.",
    acceptTerms:
      "Debes aceptar los Términos y condiciones y la Política de privacidad.",
    usernameLength:
      "Tu nombre de usuario debe tener al menos 3 caracteres.",
    usernameCharacters:
      "Tu nombre de usuario solo puede contener letras, números y guiones bajos.",
    passwordLength:
      "Tu contraseña debe tener al menos 8 caracteres.",
    emailExists:
      "Ya existe una cuenta con este correo electrónico.",
    accountFailed: "No se ha podido crear la cuenta.",
    genericError:
      "Algo ha salido mal. Inténtalo de nuevo.",
    country: "País", countryPlaceholder: "Elige tu país", timezone: "Zona horaria", timezonePlaceholder: "Elige tu zona horaria", region: "Región", regionPlaceholder: "Elige tu región", searchCountry: "Buscar país...",
    checkEmail: "Comprueba tu correo electrónico",
    confirmationSent:
      "Hemos enviado un enlace de confirmación a:",
    confirmationInstruction:
      "Haz clic en el enlace del correo electrónico para confirmar tu cuenta. Después podrás iniciar sesión y empezar a hacer pronósticos.",
    goToLogin: "Ir a iniciar sesión",
  },

  fr: {
    createAccount: "Créer un compte",
    subtitle:
      "Créez gratuitement un compte et commencez à pronostiquer.",
    firstName: "Prénom",
    lastName: "Nom",
    username: "Nom d'utilisateur",
    usernamePlaceholder: "Choisissez un nom d’utilisateur",
    usernameHelp:
      "C'est le nom que les autres joueurs verront sur VoetIQ.",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@email.fr",
    password: "Mot de passe",
    passwordPlaceholder: "Au moins 8 caractères",
    agreePrefix: "J'accepte les",
    terms: "Conditions générales",
    agreeMiddle: "et la",
    privacy: "Politique de confidentialité",
    creating: "Création du compte...",
    create: "Créer un compte",
    alreadyAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
    fillAll: "Veuillez remplir tous les champs.",
    acceptTerms:
      "Vous devez accepter les Conditions générales et la Politique de confidentialité.",
    usernameLength:
      "Votre nom d'utilisateur doit contenir au moins 3 caractères.",
    usernameCharacters:
      "Votre nom d'utilisateur ne peut contenir que des lettres, des chiffres et des tirets bas.",
    passwordLength:
      "Votre mot de passe doit contenir au moins 8 caractères.",
    emailExists:
      "Un compte existe déjà avec cette adresse e-mail.",
    accountFailed: "Le compte n'a pas pu être créé.",
    genericError:
      "Une erreur s'est produite. Veuillez réessayer.",
    country: "Pays", countryPlaceholder: "Choisissez votre pays", timezone: "Fuseau horaire", timezonePlaceholder: "Choisissez votre fuseau horaire", region: "Région", regionPlaceholder: "Choisissez votre région", searchCountry: "Rechercher un pays...",
    checkEmail: "Consultez votre e-mail",
    confirmationSent:
      "Nous avons envoyé un lien de confirmation à :",
    confirmationInstruction:
      "Cliquez sur le lien dans l'e-mail pour confirmer votre compte. Vous pourrez ensuite vous connecter et commencer à faire vos pronostics.",
    goToLogin: "Aller à la connexion",
  },

  it: {
    createAccount: "Crea account",
    subtitle:
      "Crea gratuitamente un account e inizia a fare pronostici.",
    firstName: "Nome",
    lastName: "Cognome",
    username: "Nome utente",
    usernamePlaceholder: "Scegli un nome utente",
    usernameHelp:
      "Questo è il nome che gli altri giocatori vedranno su VoetIQ.",
    email: "Indirizzo email",
    emailPlaceholder: "tu@email.it",
    password: "Password",
    passwordPlaceholder: "Almeno 8 caratteri",
    agreePrefix: "Accetto i",
    terms: "Termini e condizioni",
    agreeMiddle: "e la",
    privacy: "Politica sulla privacy",
    creating: "Creazione account...",
    create: "Crea account",
    alreadyAccount: "Hai già un account?",
    login: "Accedi",
    fillAll: "Compila tutti i campi.",
    acceptTerms:
      "Devi accettare i Termini e condizioni e la Politica sulla privacy.",
    usernameLength:
      "Il nome utente deve contenere almeno 3 caratteri.",
    usernameCharacters:
      "Il nome utente può contenere solo lettere, numeri e underscore.",
    passwordLength:
      "La password deve contenere almeno 8 caratteri.",
    emailExists:
      "Esiste già un account con questo indirizzo email.",
    accountFailed: "Impossibile creare l'account.",
    genericError:
      "Qualcosa è andato storto. Riprova.",
    country: "Paese", countryPlaceholder: "Scegli il tuo paese", timezone: "Fuso orario", timezonePlaceholder: "Scegli il tuo fuso orario", region: "Regione", regionPlaceholder: "Scegli la tua regione", searchCountry: "Cerca paese...",
    checkEmail: "Controlla la tua email",
    confirmationSent:
      "Abbiamo inviato un link di conferma a:",
    confirmationInstruction:
      "Fai clic sul link nell'email per confermare il tuo account. Dopodiché potrai accedere e iniziare a fare pronostici.",
    goToLogin: "Vai al login",
  },

  pt: {
    createAccount: "Criar conta",
    subtitle:
      "Cria uma conta gratuita e começa a fazer previsões.",
    firstName: "Nome",
    lastName: "Apelido",
    username: "Nome de utilizador",
    usernamePlaceholder: "Escolhe um nome de utilizador",
    usernameHelp:
      "Este é o nome que os outros jogadores verão no VoetIQ.",
    email: "Endereço de email",
    emailPlaceholder: "tu@email.pt",
    password: "Palavra-passe",
    passwordPlaceholder: "Mínimo de 8 caracteres",
    agreePrefix: "Aceito os",
    terms: "Termos e condições",
    agreeMiddle: "e a",
    privacy: "Política de privacidade",
    creating: "A criar conta...",
    create: "Criar conta",
    alreadyAccount: "Já tens uma conta?",
    login: "Iniciar sessão",
    fillAll: "Preenche todos os campos.",
    acceptTerms:
      "Tens de aceitar os Termos e condições e a Política de privacidade.",
    usernameLength:
      "O teu nome de utilizador deve ter pelo menos 3 caracteres.",
    usernameCharacters:
      "O teu nome de utilizador só pode conter letras, números e underscores.",
    passwordLength:
      "A tua palavra-passe deve ter pelo menos 8 caracteres.",
    emailExists:
      "Já existe uma conta com este endereço de email.",
    accountFailed: "Não foi possível criar a conta.",
    genericError:
      "Algo correu mal. Tenta novamente.",
    country: "País", countryPlaceholder: "Escolhe o teu país", timezone: "Fuso horário", timezonePlaceholder: "Escolhe o teu fuso horário", region: "Região", regionPlaceholder: "Escolhe a tua região", searchCountry: "Pesquisar país...",
    checkEmail: "Verifica o teu email",
    confirmationSent:
      "Enviámos um link de confirmação para:",
    confirmationInstruction:
      "Clica no link do email para confirmar a tua conta. Depois poderás iniciar sessão e começar a fazer previsões.",
    goToLogin: "Ir para o login",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

const COUNTRIES = [
  { code: "AF", flag: "\ud83c\udde6\ud83c\uddeb", name: "Afghanistan", timezone: "Asia/Kabul" },
  { code: "AL", flag: "\ud83c\udde6\ud83c\uddf1", name: "Albani\u00eb", timezone: "Europe/Tirane" },
  { code: "DZ", flag: "\ud83c\udde9\ud83c\uddff", name: "Algerije", timezone: "Africa/Algiers" },
  { code: "AD", flag: "\ud83c\udde6\ud83c\udde9", name: "Andorra", timezone: "Europe/Andorra" },
  { code: "AO", flag: "\ud83c\udde6\ud83c\uddf4", name: "Angola", timezone: "Africa/Luanda" },
  { code: "AG", flag: "\ud83c\udde6\ud83c\uddec", name: "Antigua en Barbuda", timezone: "America/Antigua" },
  { code: "AR", flag: "\ud83c\udde6\ud83c\uddf7", name: "Argentini\u00eb", timezone: "America/Argentina/Buenos_Aires" },
  { code: "AM", flag: "\ud83c\udde6\ud83c\uddf2", name: "Armeni\u00eb", timezone: "Asia/Yerevan" },
  { code: "AU", flag: "\ud83c\udde6\ud83c\uddfa", name: "Australi\u00eb", timezone: "Australia/Sydney" },
  { code: "AT", flag: "\ud83c\udde6\ud83c\uddf9", name: "Oostenrijk", timezone: "Europe/Vienna" },
  { code: "AZ", flag: "\ud83c\udde6\ud83c\uddff", name: "Azerbeidzjan", timezone: "Asia/Baku" },
  { code: "BS", flag: "\ud83c\udde7\ud83c\uddf8", name: "Bahama's", timezone: "America/Nassau" },
  { code: "BH", flag: "\ud83c\udde7\ud83c\udded", name: "Bahrein", timezone: "Asia/Bahrain" },
  { code: "BD", flag: "\ud83c\udde7\ud83c\udde9", name: "Bangladesh", timezone: "Asia/Dhaka" },
  { code: "BB", flag: "\ud83c\udde7\ud83c\udde7", name: "Barbados", timezone: "America/Barbados" },
  { code: "BY", flag: "\ud83c\udde7\ud83c\uddfe", name: "Belarus", timezone: "Europe/Minsk" },
  { code: "BE", flag: "\ud83c\udde7\ud83c\uddea", name: "Belgi\u00eb", timezone: "Europe/Brussels" },
  { code: "BZ", flag: "\ud83c\udde7\ud83c\uddff", name: "Belize", timezone: "America/Belize" },
  { code: "BJ", flag: "\ud83c\udde7\ud83c\uddef", name: "Benin", timezone: "Africa/Porto-Novo" },
  { code: "BT", flag: "\ud83c\udde7\ud83c\uddf9", name: "Bhutan", timezone: "Asia/Thimphu" },
  { code: "BO", flag: "\ud83c\udde7\ud83c\uddf4", name: "Bolivia", timezone: "America/La_Paz" },
  { code: "BA", flag: "\ud83c\udde7\ud83c\udde6", name: "Bosni\u00eb en Herzegovina", timezone: "Europe/Sarajevo" },
  { code: "BW", flag: "\ud83c\udde7\ud83c\uddfc", name: "Botswana", timezone: "Africa/Gaborone" },
  { code: "BR", flag: "\ud83c\udde7\ud83c\uddf7", name: "Brazili\u00eb", timezone: "America/Sao_Paulo" },
  { code: "BN", flag: "\ud83c\udde7\ud83c\uddf3", name: "Brunei", timezone: "Asia/Brunei" },
  { code: "BG", flag: "\ud83c\udde7\ud83c\uddec", name: "Bulgarije", timezone: "Europe/Sofia" },
  { code: "BF", flag: "\ud83c\udde7\ud83c\uddeb", name: "Burkina Faso", timezone: "Africa/Ouagadougou" },
  { code: "BI", flag: "\ud83c\udde7\ud83c\uddee", name: "Burundi", timezone: "Africa/Bujumbura" },
  { code: "CV", flag: "\ud83c\udde8\ud83c\uddfb", name: "Kaapverdi\u00eb", timezone: "Atlantic/Cape_Verde" },
  { code: "KH", flag: "\ud83c\uddf0\ud83c\udded", name: "Cambodja", timezone: "Asia/Phnom_Penh" },
  { code: "CM", flag: "\ud83c\udde8\ud83c\uddf2", name: "Kameroen", timezone: "Africa/Douala" },
  { code: "CA", flag: "\ud83c\udde8\ud83c\udde6", name: "Canada", timezone: "America/Toronto" },
  { code: "CF", flag: "\ud83c\udde8\ud83c\uddeb", name: "Centraal-Afrikaanse Republiek", timezone: "Africa/Bangui" },
  { code: "TD", flag: "\ud83c\uddf9\ud83c\udde9", name: "Tsjaad", timezone: "Africa/Ndjamena" },
  { code: "CL", flag: "\ud83c\udde8\ud83c\uddf1", name: "Chili", timezone: "America/Santiago" },
  { code: "CN", flag: "\ud83c\udde8\ud83c\uddf3", name: "China", timezone: "Asia/Shanghai" },
  { code: "CO", flag: "\ud83c\udde8\ud83c\uddf4", name: "Colombia", timezone: "America/Bogota" },
  { code: "KM", flag: "\ud83c\uddf0\ud83c\uddf2", name: "Comoren", timezone: "Indian/Comoro" },
  { code: "CG", flag: "\ud83c\udde8\ud83c\uddec", name: "Congo-Brazzaville", timezone: "Africa/Brazzaville" },
  { code: "CD", flag: "\ud83c\udde8\ud83c\udde9", name: "Congo-Kinshasa", timezone: "Africa/Kinshasa" },
  { code: "CR", flag: "\ud83c\udde8\ud83c\uddf7", name: "Costa Rica", timezone: "America/Costa_Rica" },
  { code: "CI", flag: "\ud83c\udde8\ud83c\uddee", name: "Ivoorkust", timezone: "Africa/Abidjan" },
  { code: "HR", flag: "\ud83c\udded\ud83c\uddf7", name: "Kroati\u00eb", timezone: "Europe/Zagreb" },
  { code: "CU", flag: "\ud83c\udde8\ud83c\uddfa", name: "Cuba", timezone: "America/Havana" },
  { code: "CY", flag: "\ud83c\udde8\ud83c\uddfe", name: "Cyprus", timezone: "Asia/Nicosia" },
  { code: "CZ", flag: "\ud83c\udde8\ud83c\uddff", name: "Tsjechi\u00eb", timezone: "Europe/Prague" },
  { code: "DK", flag: "\ud83c\udde9\ud83c\uddf0", name: "Denemarken", timezone: "Europe/Copenhagen" },
  { code: "DJ", flag: "\ud83c\udde9\ud83c\uddef", name: "Djibouti", timezone: "Africa/Djibouti" },
  { code: "DM", flag: "\ud83c\udde9\ud83c\uddf2", name: "Dominica", timezone: "America/Dominica" },
  { code: "DO", flag: "\ud83c\udde9\ud83c\uddf4", name: "Dominicaanse Republiek", timezone: "America/Santo_Domingo" },
  { code: "EC", flag: "\ud83c\uddea\ud83c\udde8", name: "Ecuador", timezone: "America/Guayaquil" },
  { code: "EG", flag: "\ud83c\uddea\ud83c\uddec", name: "Egypte", timezone: "Africa/Cairo" },
  { code: "SV", flag: "\ud83c\uddf8\ud83c\uddfb", name: "El Salvador", timezone: "America/El_Salvador" },
  { code: "GQ", flag: "\ud83c\uddec\ud83c\uddf6", name: "Equatoriaal-Guinea", timezone: "Africa/Malabo" },
  { code: "ER", flag: "\ud83c\uddea\ud83c\uddf7", name: "Eritrea", timezone: "Africa/Asmara" },
  { code: "EE", flag: "\ud83c\uddea\ud83c\uddea", name: "Estland", timezone: "Europe/Tallinn" },
  { code: "SZ", flag: "\ud83c\uddf8\ud83c\uddff", name: "Eswatini", timezone: "Africa/Mbabane" },
  { code: "ET", flag: "\ud83c\uddea\ud83c\uddf9", name: "Ethiopi\u00eb", timezone: "Africa/Addis_Ababa" },
  { code: "FJ", flag: "\ud83c\uddeb\ud83c\uddef", name: "Fiji", timezone: "Pacific/Fiji" },
  { code: "FI", flag: "\ud83c\uddeb\ud83c\uddee", name: "Finland", timezone: "Europe/Helsinki" },
  { code: "FR", flag: "\ud83c\uddeb\ud83c\uddf7", name: "Frankrijk", timezone: "Europe/Paris" },
  { code: "GA", flag: "\ud83c\uddec\ud83c\udde6", name: "Gabon", timezone: "Africa/Libreville" },
  { code: "GM", flag: "\ud83c\uddec\ud83c\uddf2", name: "Gambia", timezone: "Africa/Banjul" },
  { code: "GE", flag: "\ud83c\uddec\ud83c\uddea", name: "Georgi\u00eb", timezone: "Asia/Tbilisi" },
  { code: "DE", flag: "\ud83c\udde9\ud83c\uddea", name: "Duitsland", timezone: "Europe/Berlin" },
  { code: "GH", flag: "\ud83c\uddec\ud83c\udded", name: "Ghana", timezone: "Africa/Accra" },
  { code: "GR", flag: "\ud83c\uddec\ud83c\uddf7", name: "Griekenland", timezone: "Europe/Athens" },
  { code: "GD", flag: "\ud83c\uddec\ud83c\udde9", name: "Grenada", timezone: "America/Grenada" },
  { code: "GT", flag: "\ud83c\uddec\ud83c\uddf9", name: "Guatemala", timezone: "America/Guatemala" },
  { code: "GN", flag: "\ud83c\uddec\ud83c\uddf3", name: "Guinee", timezone: "Africa/Conakry" },
  { code: "GW", flag: "\ud83c\uddec\ud83c\uddfc", name: "Guinee-Bissau", timezone: "Africa/Bissau" },
  { code: "GY", flag: "\ud83c\uddec\ud83c\uddfe", name: "Guyana", timezone: "America/Guyana" },
  { code: "HT", flag: "\ud83c\udded\ud83c\uddf9", name: "Ha\u00efti", timezone: "America/Port-au-Prince" },
  { code: "HN", flag: "\ud83c\udded\ud83c\uddf3", name: "Honduras", timezone: "America/Tegucigalpa" },
  { code: "HU", flag: "\ud83c\udded\ud83c\uddfa", name: "Hongarije", timezone: "Europe/Budapest" },
  { code: "IS", flag: "\ud83c\uddee\ud83c\uddf8", name: "IJsland", timezone: "Atlantic/Reykjavik" },
  { code: "IN", flag: "\ud83c\uddee\ud83c\uddf3", name: "India", timezone: "Asia/Kolkata" },
  { code: "ID", flag: "\ud83c\uddee\ud83c\udde9", name: "Indonesi\u00eb", timezone: "Asia/Jakarta" },
  { code: "IR", flag: "\ud83c\uddee\ud83c\uddf7", name: "Iran", timezone: "Asia/Tehran" },
  { code: "IQ", flag: "\ud83c\uddee\ud83c\uddf6", name: "Irak", timezone: "Asia/Baghdad" },
  { code: "IE", flag: "\ud83c\uddee\ud83c\uddea", name: "Ierland", timezone: "Europe/Dublin" },
  { code: "IL", flag: "\ud83c\uddee\ud83c\uddf1", name: "Isra\u00ebl", timezone: "Asia/Jerusalem" },
  { code: "IT", flag: "\ud83c\uddee\ud83c\uddf9", name: "Itali\u00eb", timezone: "Europe/Rome" },
  { code: "JM", flag: "\ud83c\uddef\ud83c\uddf2", name: "Jamaica", timezone: "America/Jamaica" },
  { code: "JP", flag: "\ud83c\uddef\ud83c\uddf5", name: "Japan", timezone: "Asia/Tokyo" },
  { code: "JO", flag: "\ud83c\uddef\ud83c\uddf4", name: "Jordani\u00eb", timezone: "Asia/Amman" },
  { code: "KZ", flag: "\ud83c\uddf0\ud83c\uddff", name: "Kazachstan", timezone: "Asia/Almaty" },
  { code: "KE", flag: "\ud83c\uddf0\ud83c\uddea", name: "Kenia", timezone: "Africa/Nairobi" },
  { code: "KI", flag: "\ud83c\uddf0\ud83c\uddee", name: "Kiribati", timezone: "Pacific/Tarawa" },
  { code: "KP", flag: "\ud83c\uddf0\ud83c\uddf5", name: "Noord-Korea", timezone: "Asia/Pyongyang" },
  { code: "KR", flag: "\ud83c\uddf0\ud83c\uddf7", name: "Zuid-Korea", timezone: "Asia/Seoul" },
  { code: "KW", flag: "\ud83c\uddf0\ud83c\uddfc", name: "Koeweit", timezone: "Asia/Kuwait" },
  { code: "KG", flag: "\ud83c\uddf0\ud83c\uddec", name: "Kirgizi\u00eb", timezone: "Asia/Bishkek" },
  { code: "LA", flag: "\ud83c\uddf1\ud83c\udde6", name: "Laos", timezone: "Asia/Vientiane" },
  { code: "LV", flag: "\ud83c\uddf1\ud83c\uddfb", name: "Letland", timezone: "Europe/Riga" },
  { code: "LB", flag: "\ud83c\uddf1\ud83c\udde7", name: "Libanon", timezone: "Asia/Beirut" },
  { code: "LS", flag: "\ud83c\uddf1\ud83c\uddf8", name: "Lesotho", timezone: "Africa/Maseru" },
  { code: "LR", flag: "\ud83c\uddf1\ud83c\uddf7", name: "Liberia", timezone: "Africa/Monrovia" },
  { code: "LY", flag: "\ud83c\uddf1\ud83c\uddfe", name: "Libi\u00eb", timezone: "Africa/Tripoli" },
  { code: "LI", flag: "\ud83c\uddf1\ud83c\uddee", name: "Liechtenstein", timezone: "Europe/Vaduz" },
  { code: "LT", flag: "\ud83c\uddf1\ud83c\uddf9", name: "Litouwen", timezone: "Europe/Vilnius" },
  { code: "LU", flag: "\ud83c\uddf1\ud83c\uddfa", name: "Luxemburg", timezone: "Europe/Luxembourg" },
  { code: "MG", flag: "\ud83c\uddf2\ud83c\uddec", name: "Madagaskar", timezone: "Indian/Antananarivo" },
  { code: "MW", flag: "\ud83c\uddf2\ud83c\uddfc", name: "Malawi", timezone: "Africa/Blantyre" },
  { code: "MY", flag: "\ud83c\uddf2\ud83c\uddfe", name: "Maleisi\u00eb", timezone: "Asia/Kuala_Lumpur" },
  { code: "MV", flag: "\ud83c\uddf2\ud83c\uddfb", name: "Maldiven", timezone: "Indian/Maldives" },
  { code: "ML", flag: "\ud83c\uddf2\ud83c\uddf1", name: "Mali", timezone: "Africa/Bamako" },
  { code: "MT", flag: "\ud83c\uddf2\ud83c\uddf9", name: "Malta", timezone: "Europe/Malta" },
  { code: "MH", flag: "\ud83c\uddf2\ud83c\udded", name: "Marshalleilanden", timezone: "Pacific/Majuro" },
  { code: "MR", flag: "\ud83c\uddf2\ud83c\uddf7", name: "Mauritani\u00eb", timezone: "Africa/Nouakchott" },
  { code: "MU", flag: "\ud83c\uddf2\ud83c\uddfa", name: "Mauritius", timezone: "Indian/Mauritius" },
  { code: "MX", flag: "\ud83c\uddf2\ud83c\uddfd", name: "Mexico", timezone: "America/Mexico_City" },
  { code: "FM", flag: "\ud83c\uddeb\ud83c\uddf2", name: "Micronesi\u00eb", timezone: "Pacific/Pohnpei" },
  { code: "MD", flag: "\ud83c\uddf2\ud83c\udde9", name: "Moldavi\u00eb", timezone: "Europe/Chisinau" },
  { code: "MC", flag: "\ud83c\uddf2\ud83c\udde8", name: "Monaco", timezone: "Europe/Monaco" },
  { code: "MN", flag: "\ud83c\uddf2\ud83c\uddf3", name: "Mongoli\u00eb", timezone: "Asia/Ulaanbaatar" },
  { code: "ME", flag: "\ud83c\uddf2\ud83c\uddea", name: "Montenegro", timezone: "Europe/Podgorica" },
  { code: "MA", flag: "\ud83c\uddf2\ud83c\udde6", name: "Marokko", timezone: "Africa/Casablanca" },
  { code: "MZ", flag: "\ud83c\uddf2\ud83c\uddff", name: "Mozambique", timezone: "Africa/Maputo" },
  { code: "MM", flag: "\ud83c\uddf2\ud83c\uddf2", name: "Myanmar", timezone: "Asia/Yangon" },
  { code: "NA", flag: "\ud83c\uddf3\ud83c\udde6", name: "Namibi\u00eb", timezone: "Africa/Windhoek" },
  { code: "NR", flag: "\ud83c\uddf3\ud83c\uddf7", name: "Nauru", timezone: "Pacific/Nauru" },
  { code: "NP", flag: "\ud83c\uddf3\ud83c\uddf5", name: "Nepal", timezone: "Asia/Kathmandu" },
  { code: "NL", flag: "\ud83c\uddf3\ud83c\uddf1", name: "Nederland", timezone: "Europe/Amsterdam" },
  { code: "NZ", flag: "\ud83c\uddf3\ud83c\uddff", name: "Nieuw-Zeeland", timezone: "Pacific/Auckland" },
  { code: "NI", flag: "\ud83c\uddf3\ud83c\uddee", name: "Nicaragua", timezone: "America/Managua" },
  { code: "NE", flag: "\ud83c\uddf3\ud83c\uddea", name: "Niger", timezone: "Africa/Niamey" },
  { code: "NG", flag: "\ud83c\uddf3\ud83c\uddec", name: "Nigeria", timezone: "Africa/Lagos" },
  { code: "MK", flag: "\ud83c\uddf2\ud83c\uddf0", name: "Noord-Macedoni\u00eb", timezone: "Europe/Skopje" },
  { code: "NO", flag: "\ud83c\uddf3\ud83c\uddf4", name: "Noorwegen", timezone: "Europe/Oslo" },
  { code: "OM", flag: "\ud83c\uddf4\ud83c\uddf2", name: "Oman", timezone: "Asia/Muscat" },
  { code: "PK", flag: "\ud83c\uddf5\ud83c\uddf0", name: "Pakistan", timezone: "Asia/Karachi" },
  { code: "PW", flag: "\ud83c\uddf5\ud83c\uddfc", name: "Palau", timezone: "Pacific/Palau" },
  { code: "PS", flag: "\ud83c\uddf5\ud83c\uddf8", name: "Palestina", timezone: "Asia/Gaza" },
  { code: "PA", flag: "\ud83c\uddf5\ud83c\udde6", name: "Panama", timezone: "America/Panama" },
  { code: "PG", flag: "\ud83c\uddf5\ud83c\uddec", name: "Papoea-Nieuw-Guinea", timezone: "Pacific/Port_Moresby" },
  { code: "PY", flag: "\ud83c\uddf5\ud83c\uddfe", name: "Paraguay", timezone: "America/Asuncion" },
  { code: "PE", flag: "\ud83c\uddf5\ud83c\uddea", name: "Peru", timezone: "America/Lima" },
  { code: "PH", flag: "\ud83c\uddf5\ud83c\udded", name: "Filipijnen", timezone: "Asia/Manila" },
  { code: "PL", flag: "\ud83c\uddf5\ud83c\uddf1", name: "Polen", timezone: "Europe/Warsaw" },
  { code: "PT", flag: "\ud83c\uddf5\ud83c\uddf9", name: "Portugal", timezone: "Europe/Lisbon" },
  { code: "QA", flag: "\ud83c\uddf6\ud83c\udde6", name: "Qatar", timezone: "Asia/Qatar" },
  { code: "RO", flag: "\ud83c\uddf7\ud83c\uddf4", name: "Roemeni\u00eb", timezone: "Europe/Bucharest" },
  { code: "RU", flag: "\ud83c\uddf7\ud83c\uddfa", name: "Rusland", timezone: "Europe/Moscow" },
  { code: "RW", flag: "\ud83c\uddf7\ud83c\uddfc", name: "Rwanda", timezone: "Africa/Kigali" },
  { code: "KN", flag: "\ud83c\uddf0\ud83c\uddf3", name: "Saint Kitts en Nevis", timezone: "America/St_Kitts" },
  { code: "LC", flag: "\ud83c\uddf1\ud83c\udde8", name: "Saint Lucia", timezone: "America/St_Lucia" },
  { code: "VC", flag: "\ud83c\uddfb\ud83c\udde8", name: "Saint Vincent en de Grenadines", timezone: "America/St_Vincent" },
  { code: "WS", flag: "\ud83c\uddfc\ud83c\uddf8", name: "Samoa", timezone: "Pacific/Apia" },
  { code: "SM", flag: "\ud83c\uddf8\ud83c\uddf2", name: "San Marino", timezone: "Europe/San_Marino" },
  { code: "ST", flag: "\ud83c\uddf8\ud83c\uddf9", name: "Sao Tom\u00e9 en Principe", timezone: "Africa/Sao_Tome" },
  { code: "SA", flag: "\ud83c\uddf8\ud83c\udde6", name: "Saoedi-Arabi\u00eb", timezone: "Asia/Riyadh" },
  { code: "SN", flag: "\ud83c\uddf8\ud83c\uddf3", name: "Senegal", timezone: "Africa/Dakar" },
  { code: "RS", flag: "\ud83c\uddf7\ud83c\uddf8", name: "Servi\u00eb", timezone: "Europe/Belgrade" },
  { code: "SC", flag: "\ud83c\uddf8\ud83c\udde8", name: "Seychellen", timezone: "Indian/Mahe" },
  { code: "SL", flag: "\ud83c\uddf8\ud83c\uddf1", name: "Sierra Leone", timezone: "Africa/Freetown" },
  { code: "SG", flag: "\ud83c\uddf8\ud83c\uddec", name: "Singapore", timezone: "Asia/Singapore" },
  { code: "SK", flag: "\ud83c\uddf8\ud83c\uddf0", name: "Slowakije", timezone: "Europe/Bratislava" },
  { code: "SI", flag: "\ud83c\uddf8\ud83c\uddee", name: "Sloveni\u00eb", timezone: "Europe/Ljubljana" },
  { code: "SB", flag: "\ud83c\uddf8\ud83c\udde7", name: "Salomonseilanden", timezone: "Pacific/Guadalcanal" },
  { code: "SO", flag: "\ud83c\uddf8\ud83c\uddf4", name: "Somali\u00eb", timezone: "Africa/Mogadishu" },
  { code: "ZA", flag: "\ud83c\uddff\ud83c\udde6", name: "Zuid-Afrika", timezone: "Africa/Johannesburg" },
  { code: "SS", flag: "\ud83c\uddf8\ud83c\uddf8", name: "Zuid-Soedan", timezone: "Africa/Juba" },
  { code: "ES", flag: "\ud83c\uddea\ud83c\uddf8", name: "Spanje", timezone: "Europe/Madrid" },
  { code: "LK", flag: "\ud83c\uddf1\ud83c\uddf0", name: "Sri Lanka", timezone: "Asia/Colombo" },
  { code: "SD", flag: "\ud83c\uddf8\ud83c\udde9", name: "Soedan", timezone: "Africa/Khartoum" },
  { code: "SR", flag: "\ud83c\uddf8\ud83c\uddf7", name: "Suriname", timezone: "America/Paramaribo" },
  { code: "SE", flag: "\ud83c\uddf8\ud83c\uddea", name: "Zweden", timezone: "Europe/Stockholm" },
  { code: "CH", flag: "\ud83c\udde8\ud83c\udded", name: "Zwitserland", timezone: "Europe/Zurich" },
  { code: "SY", flag: "\ud83c\uddf8\ud83c\uddfe", name: "Syri\u00eb", timezone: "Asia/Damascus" },
  { code: "TJ", flag: "\ud83c\uddf9\ud83c\uddef", name: "Tadzjikistan", timezone: "Asia/Dushanbe" },
  { code: "TZ", flag: "\ud83c\uddf9\ud83c\uddff", name: "Tanzania", timezone: "Africa/Dar_es_Salaam" },
  { code: "TH", flag: "\ud83c\uddf9\ud83c\udded", name: "Thailand", timezone: "Asia/Bangkok" },
  { code: "TL", flag: "\ud83c\uddf9\ud83c\uddf1", name: "Oost-Timor", timezone: "Asia/Dili" },
  { code: "TG", flag: "\ud83c\uddf9\ud83c\uddec", name: "Togo", timezone: "Africa/Lome" },
  { code: "TO", flag: "\ud83c\uddf9\ud83c\uddf4", name: "Tonga", timezone: "Pacific/Tongatapu" },
  { code: "TT", flag: "\ud83c\uddf9\ud83c\uddf9", name: "Trinidad en Tobago", timezone: "America/Port_of_Spain" },
  { code: "TN", flag: "\ud83c\uddf9\ud83c\uddf3", name: "Tunesi\u00eb", timezone: "Africa/Tunis" },
  { code: "TR", flag: "\ud83c\uddf9\ud83c\uddf7", name: "Turkije", timezone: "Europe/Istanbul" },
  { code: "TM", flag: "\ud83c\uddf9\ud83c\uddf2", name: "Turkmenistan", timezone: "Asia/Ashgabat" },
  { code: "TV", flag: "\ud83c\uddf9\ud83c\uddfb", name: "Tuvalu", timezone: "Pacific/Funafuti" },
  { code: "UG", flag: "\ud83c\uddfa\ud83c\uddec", name: "Oeganda", timezone: "Africa/Kampala" },
  { code: "UA", flag: "\ud83c\uddfa\ud83c\udde6", name: "Oekra\u00efne", timezone: "Europe/Kyiv" },
  { code: "AE", flag: "\ud83c\udde6\ud83c\uddea", name: "Verenigde Arabische Emiraten", timezone: "Asia/Dubai" },
  { code: "GB", flag: "\ud83c\uddec\ud83c\udde7", name: "Verenigd Koninkrijk", timezone: "Europe/London" },
  { code: "US", flag: "\ud83c\uddfa\ud83c\uddf8", name: "Verenigde Staten", timezone: "America/New_York" },
  { code: "UY", flag: "\ud83c\uddfa\ud83c\uddfe", name: "Uruguay", timezone: "America/Montevideo" },
  { code: "UZ", flag: "\ud83c\uddfa\ud83c\uddff", name: "Oezbekistan", timezone: "Asia/Tashkent" },
  { code: "VU", flag: "\ud83c\uddfb\ud83c\uddfa", name: "Vanuatu", timezone: "Pacific/Efate" },
  { code: "VA", flag: "\ud83c\uddfb\ud83c\udde6", name: "Vaticaanstad", timezone: "Europe/Vatican" },
  { code: "VE", flag: "\ud83c\uddfb\ud83c\uddea", name: "Venezuela", timezone: "America/Caracas" },
  { code: "VN", flag: "\ud83c\uddfb\ud83c\uddf3", name: "Vietnam", timezone: "Asia/Ho_Chi_Minh" },
  { code: "YE", flag: "\ud83c\uddfe\ud83c\uddea", name: "Jemen", timezone: "Asia/Aden" },
  { code: "ZM", flag: "\ud83c\uddff\ud83c\uddf2", name: "Zambia", timezone: "Africa/Lusaka" },
  { code: "ZW", flag: "\ud83c\uddff\ud83c\uddfc", name: "Zimbabwe", timezone: "Africa/Harare" }
];

const MULTI_TIMEZONE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  US: [
    { value: "America/New_York", label: "New York / Eastern" },
    { value: "America/Chicago", label: "Chicago / Central" },
    { value: "America/Denver", label: "Denver / Mountain" },
    { value: "America/Phoenix", label: "Arizona" },
    { value: "America/Los_Angeles", label: "Los Angeles / Pacific" },
    { value: "America/Anchorage", label: "Alaska" },
    { value: "Pacific/Honolulu", label: "Hawaï" },
  ],
  CA: [
    { value: "America/St_Johns", label: "Newfoundland / St. John's" },
    { value: "America/Halifax", label: "Atlantic / Halifax" },
    { value: "America/Toronto", label: "Eastern / Toronto" },
    { value: "America/Winnipeg", label: "Central / Winnipeg" },
    { value: "America/Edmonton", label: "Mountain / Edmonton" },
    { value: "America/Vancouver", label: "Pacific / Vancouver" },
  ],
  AU: [
    { value: "Australia/Sydney", label: "New South Wales / Sydney" },
    { value: "Australia/Melbourne", label: "Victoria / Melbourne" },
    { value: "Australia/Brisbane", label: "Queensland / Brisbane" },
    { value: "Australia/Adelaide", label: "South Australia / Adelaide" },
    { value: "Australia/Darwin", label: "Northern Territory / Darwin" },
    { value: "Australia/Perth", label: "Western Australia / Perth" },
    { value: "Australia/Hobart", label: "Tasmania / Hobart" },
  ],
  RU: [
    { value: "Europe/Kaliningrad", label: "Kaliningrad" },
    { value: "Europe/Moscow", label: "Moskou" },
    { value: "Europe/Samara", label: "Samara" },
    { value: "Asia/Yekaterinburg", label: "Jekaterinenburg" },
    { value: "Asia/Omsk", label: "Omsk" },
    { value: "Asia/Novosibirsk", label: "Novosibirsk" },
    { value: "Asia/Krasnoyarsk", label: "Krasnojarsk" },
    { value: "Asia/Irkutsk", label: "Irkoetsk" },
    { value: "Asia/Yakutsk", label: "Jakoetsk" },
    { value: "Asia/Vladivostok", label: "Vladivostok" },
    { value: "Asia/Magadan", label: "Magadan" },
    { value: "Asia/Kamchatka", label: "Kamtsjatka" },
  ],
  BR: [
    { value: "America/Noronha", label: "Fernando de Noronha" },
    { value: "America/Sao_Paulo", label: "Brasília / São Paulo / Rio de Janeiro" },
    { value: "America/Manaus", label: "Amazonas / Manaus" },
    { value: "America/Cuiaba", label: "Mato Grosso / Cuiabá" },
    { value: "America/Rio_Branco", label: "Acre / Rio Branco" },
  ],
  MX: [
    { value: "America/Mexico_City", label: "Centraal-Mexico / Mexico-Stad" },
    { value: "America/Cancun", label: "Quintana Roo / Cancún" },
    { value: "America/Chihuahua", label: "Chihuahua" },
    { value: "America/Hermosillo", label: "Sonora / Hermosillo" },
    { value: "America/Mazatlan", label: "Sinaloa / Mazatlán" },
    { value: "America/Tijuana", label: "Baja California / Tijuana" },
  ],
  ID: [
    { value: "Asia/Jakarta", label: "West-Indonesië / Jakarta" },
    { value: "Asia/Makassar", label: "Centraal-Indonesië / Makassar" },
    { value: "Asia/Jayapura", label: "Oost-Indonesië / Jayapura" },
  ],
  CL: [
    { value: "America/Santiago", label: "Vasteland / Santiago" },
    { value: "Pacific/Easter", label: "Paaseiland" },
  ],
  EC: [
    { value: "America/Guayaquil", label: "Vasteland / Guayaquil" },
    { value: "Pacific/Galapagos", label: "Galápagoseilanden" },
  ],
  CD: [
    { value: "Africa/Kinshasa", label: "West / Kinshasa" },
    { value: "Africa/Lubumbashi", label: "Oost / Lubumbashi" },
  ],
  PG: [
    { value: "Pacific/Port_Moresby", label: "Papoea-Nieuw-Guinea / Port Moresby" },
    { value: "Pacific/Bougainville", label: "Bougainville" },
  ],
  FM: [
    { value: "Pacific/Chuuk", label: "Chuuk" },
    { value: "Pacific/Pohnpei", label: "Pohnpei" },
    { value: "Pacific/Kosrae", label: "Kosrae" },
  ],
  KI: [
    { value: "Pacific/Tarawa", label: "Gilberteilanden / Tarawa" },
    { value: "Pacific/Kanton", label: "Phoenixeilanden / Kanton" },
    { value: "Pacific/Kiritimati", label: "Line-eilanden / Kiritimati" },
  ],
  MN: [
    { value: "Asia/Ulaanbaatar", label: "Ulaanbaatar / Centraal & Oost" },
    { value: "Asia/Hovd", label: "West-Mongolië / Hovd" },
  ],
  NZ: [
    { value: "Pacific/Auckland", label: "Nieuw-Zeeland / Auckland" },
    { value: "Pacific/Chatham", label: "Chathameilanden" },
  ],
  PT: [
    { value: "Europe/Lisbon", label: "Vasteland / Madeira" },
    { value: "Atlantic/Azores", label: "Azoren" },
  ],
  ES: [
    { value: "Europe/Madrid", label: "Vasteland / Balearen" },
    { value: "Atlantic/Canary", label: "Canarische Eilanden" },
  ],
  UA: [
    { value: "Europe/Kyiv", label: "Meeste regio's / Kyiv" },
    { value: "Europe/Simferopol", label: "Krim / Simferopol" },
  ],
};


export default function RegistrerenPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);

  const t = ui[language];

  const filteredCountries = COUNTRIES.filter((item) => {
    const query = countrySearch.trim().toLowerCase();
    return !query || item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query);
  });

  const timezoneOptions = country ? MULTI_TIMEZONE_OPTIONS[country] ?? [] : [];

  function getSafeRedirect() {
    if (typeof window === "undefined") {
      return "/";
    }

    const params = new URLSearchParams(window.location.search);
    const requestedRedirect = params.get("redirect");

    return requestedRedirect?.startsWith("/") &&
      !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/";
  }

  function getLoginHref() {
    const redirect = getSafeRedirect();

    return redirect === "/"
      ? "/inloggen"
      : `/inloggen?redirect=${encodeURIComponent(redirect)}`;
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("voetiq-language");

    const initial: LanguageCode =
      saved && isLanguageCode(saved) ? saved : "nl";

    setLanguage(initial);
    document.documentElement.lang = initial;

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const next = customEvent.detail?.language;

      if (next && isLanguageCode(next)) {
        setLanguage(next);
        document.documentElement.lang = next;
      }
    }

    window.addEventListener(
      "voetiq-language-change",
      handleLanguageChange
    );

    return () =>
      window.removeEventListener(
        "voetiq-language-change",
        handleLanguageChange
      );
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanUsername ||
      !cleanEmail ||
      !password
    ) {
      setErrorMessage(t.fillAll);
      return;
    }

    if (!country || !timezone) {
      setErrorMessage(t.fillAll);
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage(t.acceptTerms);
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMessage(t.usernameLength);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrorMessage(t.usernameCharacters);
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t.passwordLength);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
            username: cleanUsername,
            country,
            timezone,
          },
        },
      });

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("already registered")
        ) {
          setErrorMessage(t.emailExists);
        } else {
          setErrorMessage(t.accountFailed);
        }

        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage(t.accountFailed);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setRegistered(true);
        setLoading(false);
        return;
      }

      window.location.href = getSafeRedirect();
    } catch (error) {
      console.error(error);
      setErrorMessage(t.genericError);
      setLoading(false);
    }
  }

  if (registered) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, rgba(46,230,129,0.10), transparent 35%), #020e09",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "block",
              color: "white",
              textDecoration: "none",
              fontSize: "32px",
              fontWeight: 900,
              marginBottom: "30px",
            }}
          >
            Voet<span style={{ color: "#2ee681" }}>IQ</span>
          </Link>

          <div
            className="register-card confirmation-card"
            style={{
              background:
                "linear-gradient(145deg, rgba(8,36,24,0.98), rgba(4,21,13,0.98))",
              border: "1px solid rgba(75,255,153,0.13)",
              borderRadius: "22px",
              padding: "35px 30px",
              boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              📧
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 900,
              }}
            >
              {t.checkEmail}
            </h1>

            <p
              style={{
                margin: "15px 0 0",
                color: "#9fb6a8",
                fontSize: "15px",
                lineHeight: 1.6,
              }}
            >
              {t.confirmationSent}
            </p>

            <p
              style={{
                margin: "10px 0 20px",
                color: "#2ee681",
                fontWeight: 800,
                wordBreak: "break-word",
              }}
            >
              {email}
            </p>

            <p
              style={{
                margin: 0,
                color: "#789183",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {t.confirmationInstruction}
            </p>

            <Link
              href={getLoginHref()}
              style={{
                display: "block",
                marginTop: "25px",
                padding: "13px",
                borderRadius: "11px",
                background: "#2ee681",
                color: "#03150b",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              {t.goToLogin}
            </Link>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 520px) {
            main {
              padding: 24px 14px !important;
            }

            .register-card {
              padding: 24px 18px !important;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(46,230,129,0.10), transparent 35%), #020e09",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            color: "white",
            textDecoration: "none",
            fontSize: "32px",
            fontWeight: 900,
            marginBottom: "30px",
          }}
        >
          Voet<span style={{ color: "#2ee681" }}>IQ</span>
        </Link>

        <div
          className="register-card"
          style={{
            background:
              "linear-gradient(145deg, rgba(8,36,24,0.98), rgba(4,21,13,0.98))",
            border: "1px solid rgba(75,255,153,0.13)",
            borderRadius: "22px",
            padding: "30px",
            boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 900,
            }}
          >
            {t.createAccount}
          </h1>

          <p
            style={{
              margin: "8px 0 26px",
              color: "#9fb6a8",
              fontSize: "14px",
            }}
          >
            {t.subtitle}
          </p>

          <form onSubmit={handleRegister}>
            <div
              className="name-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <label style={labelStyle}>{t.firstName}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.firstName}
                  autoComplete="given-name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>{t.lastName}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.lastName}
                  autoComplete="family-name"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.username}</label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                maxLength={20}
                style={inputStyle}
              />

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#789183",
                  fontSize: "12px",
                }}
              >
                {t.usernameHelp}
              </p>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.email}</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.password}</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="new-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "52px",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#8fa79a",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.country}</label>

              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setCountryOpen((open) => !open)}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color: country ? "#ffffff" : "#8fa79a",
                  }}
                >
                  <span>
                    {country
                      ? `${COUNTRIES.find((item) => item.code === country)?.flag ?? ""} ${COUNTRIES.find((item) => item.code === country)?.name ?? ""}`
                      : t.countryPlaceholder}
                  </span>
                  <span style={{ fontSize: "14px" }}>{countryOpen ? "▲" : "▼"}</span>
                </button>

                {countryOpen && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "calc(100% + 6px)",
                      zIndex: 50,
                      background: "#10241a",
                      border: "1px solid #294a37",
                      borderRadius: "12px",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "10px", borderBottom: "1px solid #294a37" }}>
                      <input
                        type="text"
                        autoFocus
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder={t.searchCountry}
                        style={{ ...inputStyle, margin: 0, width: "100%" }}
                      />
                    </div>

                    <div style={{ maxHeight: "260px", overflowY: "auto", padding: "6px" }}>
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => {
                              setCountry(item.code);

                              const options = MULTI_TIMEZONE_OPTIONS[item.code];

                              // Bij meerdere tijdzones kiest de gebruiker bewust
                              // zijn/haar regio. Bij één tijdzone vullen we hem automatisch in.
                              setTimezone(options?.length ? "" : item.timezone ?? "");

                              setCountrySearch("");
                              setCountryOpen(false);
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              background: item.code === country ? "#1c4930" : "transparent",
                              color: "#ffffff",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              textAlign: "left",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            {item.flag} {item.name}
                          </button>
                        ))
                      ) : (
                        <div style={{ padding: "12px", color: "#8fa79a", fontSize: "14px" }}>
                          Geen land gevonden.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {country && timezoneOptions.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <label style={labelStyle}>{t.region}</label>

                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{
                    ...inputStyle,
                    color: timezone ? "#ffffff" : "#8fa79a",
                  }}
                >
                  <option value="" disabled>
                    {t.regionPlaceholder}
                  </option>

                  {timezoneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "20px",
                color: "#a9bbb2",
                fontSize: "13px",
                lineHeight: 1.5,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(e.target.checked)
                }
                style={{
                  width: "17px",
                  height: "17px",
                  marginTop: "2px",
                  flexShrink: 0,
                  accentColor: "#2ee681",
                  cursor: "pointer",
                }}
              />

              <span>
                {t.agreePrefix}{" "}
                <Link
                  href="/voorwaarden"
                  target="_blank"
                  style={{
                    color: "#2ee681",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  {t.terms}
                </Link>{" "}
                {t.agreeMiddle}{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  style={{
                    color: "#2ee681",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  {t.privacy}
                </Link>
                .
              </span>
            </label>

            {errorMessage && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "rgba(255,70,70,0.08)",
                  border: "1px solid rgba(255,70,70,0.18)",
                  color: "#ff9b9b",
                  fontSize: "13px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "22px",
                padding: "14px 18px",
                border: "none",
                borderRadius: "12px",
                background: loading ? "#247a4b" : "#2ee681",
                color: "#03150b",
                fontSize: "15px",
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? t.creating : t.create}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              textAlign: "center",
              color: "#8fa79a",
              fontSize: "14px",
            }}
          >
            {t.alreadyAccount}{" "}

            <Link
              href={getLoginHref()}
              style={{
                color: "#2ee681",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              {t.login}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 520px) {
          main {
            padding: 24px 14px !important;
            align-items: flex-start !important;
          }

          .register-card {
            padding: 24px 18px !important;
          }

          .name-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#dcebe2",
  fontSize: "13px",
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "13px 14px",
  borderRadius: "11px",
  border: "1px solid rgba(75,255,153,0.12)",
  background: "rgba(255,255,255,0.045)",
  color: "white",
  outline: "none",
  fontSize: "14px",
};
