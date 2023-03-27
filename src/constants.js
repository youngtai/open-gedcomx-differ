import {generateLocalId} from "./Utils";

export const NAME_PART_TYPE = {
  prefix: 'http://gedcomx.org/Prefix',
  given: 'http://gedcomx.org/Given',
  surname: 'http://gedcomx.org/Surname',
  suffix: 'http://gedcomx.org/Suffix'
}

export const KEY_TO_LABEL_MAP = {
  'type': 'Type',
  'date': 'Date',
  'place': 'Place',
  'value': 'Value',
  'primary': 'Primary'
};

export const GENDER = {
  Male: 'http://gedcomx.org/Male',
  Female: 'http://gedcomx.org/Female',
  Unknown: 'http://gedcomx.org/Unknown'
};

export const FACT_KEYS = {
  type: 'type',
  date: 'date',
  place: 'place',
  value: 'value',
  primary: 'primary',
  qualifiers: 'qualifiers',
  id: 'id',
  fields: 'fields',
  confidence: 'confidence',
  formal: 'formal',
  description: 'description',
};

export const IGNORED_FACT_KEYS = [
  FACT_KEYS.id,
  FACT_KEYS.fields,
  FACT_KEYS.confidence,
  FACT_KEYS.formal,
  FACT_KEYS.description
];

export const COVERAGE_ATTRIBUTES = {
  spatial: 'spatial',
  temporal: 'temporal',
  recordType: 'recordType'
}

export const GEDCOMX_ORG_PREFIX = `http://gedcomx.org/`;

export const FACT_QUALIFIER = {
  Age: `${GEDCOMX_ORG_PREFIX}Age`,
  Cause: `${GEDCOMX_ORG_PREFIX}Cause`
}

export const PERSON_NAME_TYPE = {
  BirthName: `${GEDCOMX_ORG_PREFIX}BirthName`,
  MarriedName: `${GEDCOMX_ORG_PREFIX}MarriedName`,
  AlsoKnownAs: `${GEDCOMX_ORG_PREFIX}AlsoKnownAs`,
  Nickname: `${GEDCOMX_ORG_PREFIX}Nickname`,
  FormalName: `${GEDCOMX_ORG_PREFIX}FormalName`,
  ReligiousName: `${GEDCOMX_ORG_PREFIX}ReligiousName`
}

const FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX = 'http://familysearch.org/types/relationships/';

export const RELATIONSHIP = {
  Couple: `${GEDCOMX_ORG_PREFIX}Couple`,
  ParentChild: `${GEDCOMX_ORG_PREFIX}ParentChild`,
  DivorcedCouple: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}DivorcedCouple`,
  Fiance: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Fiance`,
  DomesticPartnership: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}DomesticPartnership`,
  Sibling: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Sibling`,
  Grandparent: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Grandparent`,
  GreatGrandparent: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}GreatGrandparent`,
  SiblingInLaw: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}SiblingInLaw`,
  StepSibling: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}StepSibling`,
  ParentChildInLaw: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}ParentChildInLaw`,
  StepParentChild: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}StepParentChild`,
  GuardianParentChild: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}GuardianParentChild`,
  SurrogateParentChild: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}SurrogateParentChild`,
  AuntOrUncle: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}AuntOrUncle`,
  Cousin: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Cousin`,
  Godparent: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Godparent`,
  Descendant: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Descendant`,
  Relative: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Relative`,
  NonRelative: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}NonRelative`,
  Unknown: `${FAMILYSEARCH_TYPES_RELATIONSHIPS_PREFIX}Unknown`
}

const FAMILYSEARCH_TYPES_FIELDS_PREFIX = 'http://familysearch.org/types/fields/';

export const RECORD_FIELD_TYPE = {
  DigitalFilmNbr: `${FAMILYSEARCH_TYPES_FIELDS_PREFIX}DigitalFilmNbr`,
  ImageNumber: `${FAMILYSEARCH_TYPES_FIELDS_PREFIX}ImageNumber`,
  RecordStyle: `${FAMILYSEARCH_TYPES_FIELDS_PREFIX}RecordStyle`,
  CrossType: `${FAMILYSEARCH_TYPES_FIELDS_PREFIX}CrossType`
};

export const PERSON_FIELD_TYPE = {
  Age: `${GEDCOMX_ORG_PREFIX}Age`,
  Role: `${GEDCOMX_ORG_PREFIX}Role`
};

export const FACT_TYPE = {
  Birth: `${GEDCOMX_ORG_PREFIX}Birth`,
  Death: `${GEDCOMX_ORG_PREFIX}Death`,
  Residence: `${GEDCOMX_ORG_PREFIX}Residence`,
  Baptism: `${GEDCOMX_ORG_PREFIX}Baptism`,
  Burial: `${GEDCOMX_ORG_PREFIX}Burial`,
  Census: `${GEDCOMX_ORG_PREFIX}Census`,
  Christening: `${GEDCOMX_ORG_PREFIX}Christening`,
  Confirmation: `${GEDCOMX_ORG_PREFIX}Confirmation`,
  MaritalStatus: `${GEDCOMX_ORG_PREFIX}MaritalStatus`,
  Obituary: `${GEDCOMX_ORG_PREFIX}Obituary`,
  Occupation: `${GEDCOMX_ORG_PREFIX}Occupation`
};

export const RELATIONSHIP_FACT_TYPE = {
  Annulment: `${GEDCOMX_ORG_PREFIX}Annulment`,
  CommonLawMarriage: `${GEDCOMX_ORG_PREFIX}CommonLawMarriage`,
  CivilUnion: `${GEDCOMX_ORG_PREFIX}CivilUnion`,
  Divorce: `${GEDCOMX_ORG_PREFIX}Divorce`,
  DivorceFiling: `${GEDCOMX_ORG_PREFIX}DivorceFiling`,
  DomesticPartnership: `${GEDCOMX_ORG_PREFIX}DomesticPartnership`,
  Engagement: `${GEDCOMX_ORG_PREFIX}Engagement`,
  Marriage: `${GEDCOMX_ORG_PREFIX}Marriage`,
  MarriageBanns: `${GEDCOMX_ORG_PREFIX}MarriageBanns`,
  MarriageContract: `${GEDCOMX_ORG_PREFIX}MarriageContract`,
  MarriageLicense: `${GEDCOMX_ORG_PREFIX}MarriageLicense`,
  MarriageNotice: `${GEDCOMX_ORG_PREFIX}MarriageNotice`,
  NumberOfChildren: `${GEDCOMX_ORG_PREFIX}NumberOfChildren`,
  Separation: `${GEDCOMX_ORG_PREFIX}Separation`,
  AdoptiveParent: `${GEDCOMX_ORG_PREFIX}AdoptiveParent`,
  BiologicalParent: `${GEDCOMX_ORG_PREFIX}BiologicalParent`,
  FosterParent: `${GEDCOMX_ORG_PREFIX}FosterParent`,
  GuardianParent: `${GEDCOMX_ORG_PREFIX}GuardianParent`,
  StepParent: `${GEDCOMX_ORG_PREFIX}StepParent`,
  SociologicalParent: `${GEDCOMX_ORG_PREFIX}SociologicalParent`,
  SurrogateParent: `${GEDCOMX_ORG_PREFIX}SurrogateParent`
};

export const GEDCOMX_ORIGINAL = `${GEDCOMX_ORG_PREFIX}Original`;

export const PERSON_FACT_BACKGROUND_COLOR = '#eeeeee';
export const DIFF_BACKGROUND_COLOR = '#ffe9e9';

export const EMPTY_GEDCOMX = {
  id: generateLocalId(),
  attribution: {},
  description: '',
  persons: [],
  relationships: [],
  sourceDescriptions: [],
  documents: [],
  fields: []
};