// Utility function to serialize Sequelize models
export function serializeModel(instance) {
  if (!instance) return instance // Handle null or undefined early

  // Handle arrays: short-circuit if unnecessary to process all elements
  if (Array.isArray(instance)) {
    // Check if the first element requires serialization; assume others do if the first does
    if (instance.length === 0) return instance

    const firstElementNeedsSerialization = typeof instance[0]?.toJSON === 'function'

    if (!firstElementNeedsSerialization) {
      return instance // If the first element doesn't need serialization, assume others don't either
    }

    // If serialization is needed, process the whole array
    return instance.map(serializeModel)
  }

  // If the instance has a toJSON method, we serialize it
  if (typeof instance?.toJSON === 'function') {
    return instance.toJSON()
  }

  // Handle plain objects (non-Array, non-Model) by recursively serializing values
  if (typeof instance === 'object') {
    for (const key in instance) {
      if (Object.hasOwnProperty.call(instance, key)) {
        instance[key] = serializeModel(instance[key])
      }
    }
    return instance
  }

  // Return primitive values as is
  return instance
}
