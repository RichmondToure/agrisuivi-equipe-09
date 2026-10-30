// MEMBRE 4 — Données : lire et écrire les fichiers JSON de façon asynchrone.
// Fiche : fiches/4-donnees.md · Vérifier : npm run test:donnees
// À faire EN PREMIER : sans lireJson et chargerDonnees, l'application ne peut rien afficher.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Lit un fichier JSON et renvoie son contenu converti en valeur JavaScript.
// En cas de problème, lance une erreur claire qui garde l'erreur d'origine comme cause.
export async function lireJson(chemin) 
{
  try{
    const contenuTexte=await readFile(chemin,"utf8");
  return JSON.parse(contenuTexte);
 } catch (erreur){
  throw new Error (`Impossible de lire le fichier JSON : ${chemin}`,{
    cause: erreur
  });
 }
}

// Lit les quatre fichiers EN MÊME TEMPS avec Promise.all.
// Renvoie { parcelles, cultures, releves, recoltes }.
export async function chargerDonnees(dossier) {
    const [
      parcelles,
      cultures,
      releves,
      recoltes
    ] = await Promise.all([lireJson(join(dossier, "parcelles.json")),
      lireJson(join(dossier,"cultures.json")),
      lireJson(join(dossier,"releves.json")),
      lireJson(join(dossier,"recoltes.json"))
    ]);
    return{
      parcelles, cultures, releves, recoltes, 
    };
  }

// Vérifie les textes tapés dans le terminal et renvoie un nouveau relevé.
// Exemple : creerReleve('p07', '64', '29', '2026-10-29')
//   → { parcelle: 'P07', date: '2026-10-29', humidite: 64, temperature: 29 }
export function creerReleve(parcelle, humiditeTexte, temperatureTexte, date) {
  if(!parcelle || parcelle.trim() ===""){
     throw new Error("la parcelle est absente ou invalide.");
  }
const humidite = Number(humiditeTexte);
if(Number.isNaN(humidite)|| humidite < 0 || humidite >100 ){
  throw new Error("L'humidité doit etre un nombre.");
}
if(humidite < 0|| humidite > 100){
  throw new Error ("L'humidité doit etre comprise entre 0 et 100.");
}
const temperature = Number(temperatureTexte);
if(Number.isNaN(temperature)) {
  throw new Error ("La temperature doit etre un nombre.");
}
return {parcelle : parcelle.toUpperCase(), date, humidite, temperature};
}


// Ajoute le relevé à la fin du fichier JSON, enregistre le fichier,
// puis renvoie le nouveau nombre de relevés.
export async function ajouterReleve(chemin, releve) {
  const releves = await lireJson(chemin);
  releves.push(releve);
  await writeFile(chemin, JSON.stringify(releves, null, 2), "utf8");
  return releves.length;
}