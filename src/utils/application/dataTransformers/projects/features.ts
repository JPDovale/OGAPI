import { type IFeaturesProjectUses } from '@modules/projects/infra/repositories/entities/IProject'

export function getFeaturesLabelsAndValues(
  features: IFeaturesProjectUses,
): Array<{ label: string; selected: boolean }> {
  const featuresTransformed: Array<{ label: string; selected: boolean }> = [
    {
      label: 'book',
      selected: features.books,
    },
    {
      label: 'city',
      selected: features.citys,
    },
    {
      label: 'family',
      selected: features.familys,
    },
    {
      label: 'inst',
      selected: features.institutions,
    },
    {
      label: 'language',
      selected: features.languages,
    },
    {
      label: 'nation',
      selected: features.nations,
    },
    {
      label: 'person',
      selected: features.persons,
    },
    {
      label: 'planet',
      selected: features.planets,
    },
    {
      label: 'plot',
      selected: features.plot,
    },
    {
      label: 'power',
      selected: features.powers,
    },
    {
      label: 'race',
      selected: features.races,
    },
    {
      label: 'religion',
      selected: features.religions,
    },
    {
      label: 'time-lines',
      selected: features.timeLines,
    },
  ]

  return featuresTransformed
}

export function getFeatures(featuresList: string): IFeaturesProjectUses {
  const featuresInProject = featuresList.split('|')

  const features = {
    books: !!featuresInProject.find((feature) => feature === 'book'),
    citys: !!featuresInProject.find((feature) => feature === 'city'),
    familys: !!featuresInProject.find((feature) => feature === 'family'),
    institutions: !!featuresInProject.find((feature) => feature === 'inst'),
    languages: !!featuresInProject.find((feature) => feature === 'language'),
    nations: !!featuresInProject.find((feature) => feature === 'nation'),
    persons: !!featuresInProject.find((feature) => feature === 'person'),
    planets: !!featuresInProject.find((feature) => feature === 'planet'),
    plot: !!featuresInProject.find((feature) => feature === 'plot'),
    powers: !!featuresInProject.find((feature) => feature === 'power'),
    races: !!featuresInProject.find((feature) => feature === 'race'),
    religions: !!featuresInProject.find((feature) => feature === 'religion'),
    timeLines: !!featuresInProject.find((feature) => feature === 'time-lines'),
  }

  return features
}

export function getListFeaturesInLine(features: IFeaturesProjectUses): string {
  const featuresList = getFeaturesLabelsAndValues(features)

  let newListFeatures = ''

  featuresList.map((feature) => {
    if (feature.selected) {
      newListFeatures = newListFeatures + `${feature.label}|`
    }

    return ''
  })

  return newListFeatures
}
