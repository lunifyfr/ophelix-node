/** Ce qu'accepte toute lecture : les champs liés à déplier, comme `patient` ou `data.patient`. */
export interface ExpandParams {
  expand?: string[]
}

/** Ce qu'accepte toute liste, en plus de ses filtres. */
export interface ListParams extends ExpandParams {
  /** Le nombre d'objets par page, de 1 à 100. Par défaut, 25. */
  limit?: number
  /** Un identifiant : la page qui suit cet objet. */
  starting_after?: string
  /** Un identifiant : la page qui précède cet objet. */
  ending_before?: string
}
