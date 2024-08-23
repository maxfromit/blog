export default (req, res) => {
  res.status(200).send(`Hello from there, ${req.query.name}!`)
  // const payload = req.payload;
  console.log('table.name', req.body.table.name)
  console.log('operation type', req.body.event.op)
  console.log('user-id', req.body.event.session_variables['x-hasura-user-id'])
  console.log('req', req.body.event.data)

  // console.log('req', req)
}
