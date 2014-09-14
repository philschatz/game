fromHash = require './from-hash'

textures = [
  'stone' # This one should never be used since it is the black
  ['grass', 'grass', 'square-light-pyramid-in'] # ['grass', 'dirt', 'grass_dirt'],
  'square-medium-pyramid-in'
  'square-dark-pyramid-in'
  ['grass', 'grass', 'square-grasstop-light-pyramid-out']
  'bridge-post-top'
  'bridge'
  'bridge-post'
  'obelisk-3'
  'obelisk-2'
  'obelisk-1'
  'lighthouse-red'
  'lighthouse-white'
]

textureVariants = [
  null
  ['square-light-pyramid-in', 'square-light-pyramid-out', 'square-light-square-in', 'square-light-square-out']
  ['square-medium-pyramid-in', 'square-medium-pyramid-out', 'square-medium-square-in', 'square-medium-square-out']
  ['square-dark-pyramid-in', 'square-dark-pyramid-out', 'square-dark-square-big', 'square-dark-square-in']
  ['square-grasstop-light-pyramid-out', 'square-grasstop-light-square-out']
]


textureVariantColors = []
newColor = textures.length
for variantNames, origColor in textureVariants
  if variantNames
    textureVariantAry = []
    for variantName in variantNames
      textures.push(variantName)
      textureVariantAry.push(newColor)
      newColor++

    textureVariantColors.push(textureVariantAry)
  else
    textureVariantColors.push(null)


console.log 'textures:', textures
console.log 'textureVariantColors: ', textureVariantColors

playerPosition = [1, 7, 3]


hash =  ':A/aWpaieaePaiiaiiammaiiakkaiiaSdaoYakcaieaXoShahfbbhhYhShYfShYhShYfShYhYhSfYhShYhSfYhShYhSfYhShYhSfYhShSeYfSfYhSfYfSfYhSfYfSfYhSfYfahfYfYfShYfSfYfShYfSfYfShYfSfYfShYfSfSiYhShYfShYhWhhYfYfShYhYhShYfYfShYhYhShYfYfShYhYhYhSfSfYhShShYhSfSfYhShShYhSfaihSfSfahhSfaffYhSfYfSfYhaffYhaffYhaffYhSfYfahfYfafhSfYfShYfSfYfShYfSfYfShaffShaffSiafeahhYfaihYeaihShYfSfYfShaqmfYhbiShShYhYhYhYhYhYhaadSfSfSfamlSfSfSfSfabfYhYhYhYhYhcahShShShShShShYhYhYhYhYhYhSfSfSfSfSfSfYfYfYfYfYfbeifSfSfSfSfahhSfahhSfajhSfahhSfahhSfahhSfSiShShSkShShffeffShShafefhihhSfYcShaffShaffShafeShShUhSfSfbhfhSfSfbfffSfSfSfSfYhYhYjYhYhYhaahYhYhYhaefYhakhShShShShShShShShShaffShbfehYfThfShaffShYfYfYfcfhSfSfSfSfSfSfSfSfSfSfYhYhYhYhYhYhYhYhShShShShShShShShShShaffYfahhYfYfYfYfYfYfbfhfShYfSfSfSeSfSfSbSfSfYhYhYmaXtSfSfSeSfSfSbSfSfYoajhSfYhafiShSkShShShShShShYhaefShaffShaffShaffShadfShaffShddhjSfSfSfSfSfSfSfSfSfSfSfSfSfYhYhYhYhYhYhYhYhYhYhYhYhYhShShShShShShShShShShShShShYfYfYfYfYfYfYfYfYfYfYfYfSfSfSfSfSfSfSfSfSfSfSfSfahrSfSfSfSfSfSfSfSfSfSfSfahrSfSfSfSfSfSfSfSfSfSfSffaalcYhYhShYfYfappYhfYmVmYfYfYfTfhVheVeiUfUfUfUfUfUfUfdcpefjfhhYfYfYfXYfhUhUhUhUhUhUhUhUhccYUhUhUhUhUhUhUhUhVhefjfhhYfYfYfShYhYhYhYhYhYhYhYhYhYhYhShYfYfYfYfYfYfYfYfYfYfYffoYihUhUhUhUhUhUhUhUhVhedcXiUhUhUhUhUhUhUhUhVhedcYiUfUiUhUhUhUhUhUhVheXZhbShShShShShShShShShShShShShYfYfYfYfYfUhUhUhUhVikShShShShShXfbdShShShShShfehbjYfYfYfdkfdYfYeYfajhZfhUfYhYhYdajhYfYfYfajhYeYfajhYeYffiffhYfahfYfehhhfehffbfffbhihZffShShYkYfYfYfffhcjYhYhYhYhShYfYfYfYfShYhYhYhYhShYfYfYfYfShYhYhYhYhfehekVhhVhhfiddabmRiYhYhYhYhYhYhYhYhYhYhYhblkeSfSfSfSfSfSfSfSfSfSfSfYhShShShShShShShShShShShahVShShShShShShShShShShShYhSfSfSfSfSfSfSfSfSfSfSfYhShShShShShShShShShShShYhSfSfSfSfSfSfSfSfSfSfSfYhShShShShShShShShShShShYhSfSfSfSfSfSfSfSfSfSfSfYhShShShShShShShShShShShfahZnYfYfYfSfSfSfYhYhYhShShXhhhYfYfYfSfSfSfYhYhYhShShXhhfYfYfYfSfSfSfYhYhYhShShXhhhYfYfYfSfSfSfYhYhYhShShXhhfYfYfYfSfSfSfYhYhYhShShXhhhYfYfYfSfSfSfYhYhYhShShXhhfYfYfYfSfSfSfYhYhYhShShXhhhYfYfYfSfSfSfYhYhYhShShXhhfYfYfYfSfSfSfYhYhYhShShXhhhYfYfYfSfSfSfYhYhYhShShXhhfYfYfYfSfSfSfYhYhYhShShXhhhYfYfYfSfSfSfYhYhYhShShXhhfYfYfYfSfSfSfYhYhYhShSh'


variantMapper = (c) ->
  # Generates variants randomly
  variants = textureVariantColors[c]
  return c unless variants
  return variants[Math.floor(Math.random() * variants.length)]

map = fromHash(hash, variantMapper)


module.exports = {map, textures, playerPosition}
