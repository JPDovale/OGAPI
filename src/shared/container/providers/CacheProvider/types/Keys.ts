export enum KeysRedis {
  user = 'user-',

  project = 'project-',
  objectivesProject = 'objectives-project-',
  personalitiesProject = 'personalities-project-',
  valuesProject = 'values-project-',
  traumasProject = 'traumas-project-',
  appearancesProject = 'appearances-project-',
  dreamsProject = 'dreams-project-',
  fearsProject = 'fears-project-',
  wishesProject = 'wishes-project-',
  powersProject = 'powers-project-',

  book = 'book-',
  capitule = 'capitule-',
  person = 'person-',

  boxes = 'boxes-',

  products = 'products',
}

export type IKeysRedis = keyof typeof KeysRedis
export type KeysUnchecked = `${IKeysRedis}-${string}`
