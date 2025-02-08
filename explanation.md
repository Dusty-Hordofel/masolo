## 📌 Pourquoi className n’est pas défini dans les props sans générer d’erreur ?

Dans ce code TypeScript :

```ts
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";
```

✅ Explication

    1.	React.HTMLAttributes<HTMLDivElement> est une interface qui inclut toutes les propriétés HTML valides pour une <div>, y compris className.
    2.	Destructuration des props :
    •	className est extrait des props sans être défini explicitement.
    •	...props récupère toutes les autres propriétés valides pour un <div>.
    3.	Pourquoi ça marche ?
    •	TypeScript comprend que className fait partie de React.HTMLAttributes<HTMLDivElement>, donc pas besoin de le redéclarer.

🎯 Solution équivalente avec typage explicite

Si tu voulais déclarer className manuellement, tu pourrais faire :

```ts
interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
```

🚀 Conclusion

Ce n’est pas nécessaire d’ajouter className manuellement, car React.HTMLAttributes<HTMLDivElement> l’inclut déjà ! 🎉

## 🧐 Pourquoi SheetFooter (ou SheetBody) reçoit des children alors qu’ils ne sont pas explicitement mentionnés ?

Dans le code suivant :

```ts
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props} // ⬅ Ici, on passe toutes les props restantes à <div>
  />
);

SheetFooter.displayName = "SheetFooter";
```

✨ Explication

L’astuce repose sur l’utilisation de ...props.

1. React.HTMLAttributes<HTMLDivElement>

   • Ce type inclut toutes les props valides d’un <div>, y compris children.
   • TypeScript comprend donc que props.children peut être passé au <div>.

2. ...props dans le <div>

   • Dans JSX, quand on passe {...props}, cela inclut automatiquement children s’il est défini.

📌 Même si on ne l’écrit pas explicitement (children), il est inclus via ...props.

🛠 Exemple concret d’utilisation

```ts
<SheetFooter className="bg-gray-200 p-4">
  <button>Cancel</button>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
</SheetFooter>
```

🔹 Ici, les boutons sont passés comme children.
🔹 SheetFooter les reçoit via props et les injecte dans <div {...props} />.

✅ Comment écrire children explicitement ?

Si tu veux être plus clair, tu peux déstructurer children explicitement :

const SheetFooter = ({
children,
className,
...props
}: React.HTMLAttributes<HTMLDivElement>) => (

  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}>
    {children} {/* ⬅ Ici, on affiche explicitement les enfants */}
  </div>
);

Cela ne change pas le fonctionnement, mais rend le code plus explicite.

🚀 Conclusion

    •	children est automatiquement inclus grâce à ...props.
    •	Pas besoin de l’écrire explicitement si tu utilises React.HTMLAttributes<HTMLDivElement>.
    •	Si tu veux être plus clair, tu peux quand même l’ajouter dans la déstructuration.

💡 Astuce : Cette technique est très courante pour créer des composants réutilisables sans avoir à lister toutes les props à la main.

## 📌 Rôle de SheetFooter.displayName = "SheetFooter";

Dans le code suivant :

```ts
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

SheetFooter.displayName = "SheetFooter";
```

✨ 1. À quoi sert displayName ?

L’attribut displayName est utilisé principalement pour le débogage et les outils de développement React.

✅ Son but est de donner un nom lisible au composant lorsqu’il apparaît :
• Dans les DevTools de React
• Lors de l’affichage d’erreurs ou de warnings
• Dans les messages de debugging

🔍 2. Exemple sans displayName

Si SheetFooter est défini avec une fonction anonyme comme ceci :

const SheetFooter = ({ className, ...props }) => (

  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

📌 Problème : Dans les outils de développement React, ce composant peut être affiché sous un nom générique comme “Anonymous” ou simplement “div”, ce qui rend le debugging plus difficile.

🎯 3. Avec displayName

En ajoutant :

SheetFooter.displayName = "SheetFooter";

✅ Les DevTools et messages d’erreur afficheront clairement "SheetFooter".
Cela facilite l’identification du composant.

🛠 4. Exemple en DevTools React

Avec displayName, tu verras clairement le nom dans React DevTools :

<SheetFooter>
  <button>Cancel</button>
  <button>Save</button>
</SheetFooter>

⬇ Dans les outils de développement React ⬇

<div>
  <SheetFooter>  ✅ (Nom explicite dans React DevTools)
    <button>Cancel</button>
    <button>Save</button>
  </SheetFooter>
</div>

🚀 5. Quand est-ce utile ?

    •	Dans les bibliothèques de composants comme Radix UI, shadcn/ui, Chakra UI, etc.
    •	Pour les composants anonymes ou inline, qui sinon auraient un nom générique.
    •	Lors du debugging, pour identifier rapidement un composant spécifique.

🎯 6. Faut-il toujours l’ajouter ?

    •	Non, si tu déclares ton composant avec un nom explicite, React l’affichera correctement.
    •	Oui, si ton composant est anonyme ou si tu utilises une HOC (Higher Order Component) qui pourrait masquer le nom du composant.

Exemple d’un composant anonyme :

export default () => <div>Some content</div>;

📌 Ici, React ne pourra pas afficher un nom clair dans les DevTools, donc ajouter displayName serait utile.

✅ Conclusion

✔ displayName est principalement une aide au debugging pour React DevTools et les erreurs.
✔ Il n’affecte pas le comportement du composant, mais améliore la lisibilité et la maintenance.
✔ Recommandé si tu utilises des composants anonymes ou des HOC.

💡 Bonne pratique : L’ajouter dans les bibliothèques de composants réutilisables ! 🚀
