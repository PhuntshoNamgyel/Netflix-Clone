module.exports = {
    notification: (message) => ({
      type: "notification",
      payload: { message }
    }),
    dataSync: (data) => ({
      type: "dataSync",
      payload: data
    }),
    error: (msg) => ({
      type: "error",
      payload: { message: msg }
    })
  };