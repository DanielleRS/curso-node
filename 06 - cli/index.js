const { Command}  = require('commander')
const Database = require('./database')
const Heroi = require('./heroi')

async function main() {
    const program = new Command()

    program
        .version('v1')
        .option('-n, --nome [value]', "Nome do herói")
        .option('-p, --poder [value]', "Poder do herói")
        .option('-i, --id [value]', "Id do herói")

        .option('-c, --cadastrar', "Cadastrar um herói")
        .option('-l, --listar', "Listar um herói")
        .option('-r, --remover', "Remover um herói pelo id")
        .option('-a, --atualizar [value]', "Atualizar um herói pelo id")
        
    program.parse(process.argv)

    const options = program.opts()
    const heroi = new Heroi(options)

    try {
        if(options.cadastrar) {
            delete heroi.id

            const resultado = await Database.cadastrar(heroi)

            if(!resultado) {
                console.error('Herói não foi cadastrado!')
                return
            }
            console.log('Herói cadastrado com sucesso!')
        }

        if(options.listar) {
            const resultado = await Database.listar()
            console.log(resultado)
            return
        }

        if(options.remover) {
            const resultado = await Database.remover(heroi.id)
            if(!resultado) {
                console.error('Não foi possível remover o herói')
                return
            }

            console.log('Herói removido com sucesso!')
        }

        if(options.atualizar) {
            const idParaAtualizar = parseInt(options.atualizar)
            // remover todas as chaves que estiverem com undefined || null
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)

            if(!resultado) {
                console.error('Não foi possível atualizar o herói')
                return
            }
            console.log('Herói atualizado com sucesso!')
        }

    } catch(error) {
        console.error('DEU RUIM', error)
    }
}

main()