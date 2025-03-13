const express = require('express')
const cors = require('cors')
const { createClient } = require('redis')

const app = express()
app.use(cors())

const redisClient = createClient({
	url: 'redis://redis:6379'
})

const subscriber = redisClient.duplicate()

async function connectRedis() {
	try {
		await redisClient.connect()
		await subscriber.connect()
		console.log('✅ Connected to Redis!')
	} catch (err) {
		console.error('❌ Redis connection error:', err)
	}
}

connectRedis()

const clients = {}

app.get('/sse/:userId', (req, res) => {
	const { userId } = req.params

	res.setHeader('Content-Type', 'text/event-stream')
	res.setHeader('Cache-Control', 'no-cache')
	res.setHeader('Connection', 'keep-alive')

	if (!clients[userId]) {
		clients[userId] = []
	}
	clients[userId].push(res)

	console.log(`User ${userId} connected. Total clients: ${clients[userId].length}`)

	// Ping 15 secondes
	const pingInterval = setInterval(() => {
		res.write(': ping\n\n')
		console.log(`ping ${userId}`)
	}, 15000)

	req.on('close', () => {
		clearInterval(pingInterval)
		clients[userId] = clients[userId].filter((client) => client !== res)
		console.log(`User ${userId} disconnected. Remaining clients: ${clients[userId].length}`)
	})
})

subscriber.pSubscribe('user.*', (message, channel) => {
	console.log(`🔔 Message on ${channel}: ${message}`)

	const userId = channel.split('.')[1]
	const payload = JSON.parse(message)

	if (clients[userId]) {
		console.log(`📣 Broadcasting to user ${userId}`)
		clients[userId].forEach((res) => {
			res.write(`event: newEntry\n`)
			res.write(`data: ${JSON.stringify(payload)}\n\n`)
		})
	}
})

const port = 4000
app.listen(port, () => {
	console.log(`🚀 SSE server listening on http://localhost:${port}`)
})
