const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js')

const token = '5364836267:AAHPoXuTm7QPKrMiSz7wOEspD1lwbE60dfo'

const bot = new TelegramApi(token, {polling: true})

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать')
    const randomNumber =  Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d3f/ec8/d3fec829-7a83-4704-996b-5b4f8cadd729/4.jpg')
            return bot.sendMessage(chatId, `Добро пожаловать, долбоеб!!!`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if ( text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, `Я тебя нихуя не понимаю`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Ахуеть, ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ебать ты лох, а бот выбрал ${chats[chatId]}`, againOptions)
        }
    })
}

start()