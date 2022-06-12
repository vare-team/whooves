import { ShardingManager } from 'discord.js'
import logger from './utils/logger'

const manager = new ShardingManager(
  './whooves.js',
  {
    token: process.env.token
  }
)

manager
  .spawn()
  .then(() =>
    logger('Spawned!', 'ShardingManager', 'Log')
  )

manager
  .on(
    'shardCreate',
    () =>
      logger('Launched!', 'ShardingManager', 'Log')
  )
