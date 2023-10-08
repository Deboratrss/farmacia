let filtros = []
let sortStartegy = porMaisVendidos

function filterWith(event) {
    const checked = event.target.checked
    const value = event.target.value

    if(checked) {
        filtros.push(value)
    } else {
        filtros = filtros.filter(v => v!==value)
    }

    if(filtros.length === 0) generateProdutos(sortStartegy, identity)
    else generateProdutos(sortStartegy, findAny)
}

function findAny(data) {
    return filtros.includes(data.categoria) ||
        filtros.includes(data.tipoMedicamento) ||
        filtros.includes(data.viaAdministracao)
}

function createFiltro(dados) {
    const container = document.createElement('div')

    const legend = document.createElement('legend')
    legend.innerText = dados.label

    container.appendChild(legend)
    container.appendChild(document.createElement('br'))

    for(let option of dados.options) {
        const optionContainer = document.createElement('div')

        const optionLabel = document.createElement('label')
        optionLabel.innerText = option
        optionLabel.setAttribute("for", option)

        const optionInput = document.createElement('input')
        optionInput.setAttribute('type', 'checkbox')
        optionInput.setAttribute('id', option)
        optionInput.setAttribute('name', option)
        optionInput.setAttribute('value', option)
        optionInput.onclick = filterWith

        optionContainer.appendChild(optionInput)
        optionContainer.appendChild(optionLabel)

        container.appendChild(optionContainer)
    }

    container.appendChild(document.createElement('br'))

    return container
}

function generateFiltros() {
    fetch("../data/filtros.json")
        .then(r => r.json())
        .then(filtros => {
            for(let filtro in filtros) {
                const filtroDOM = createFiltro(filtros[filtro])
                document.getElementById('catalogo').appendChild(filtroDOM)
            }
        })
}

function createProduto(dados) {
    const container = document.createElement('div')
    container.setAttribute("class", "cards")

    const img = document.createElement('img')
    img.src = dados.img

    const p = document.createElement("p")
    p.innerText = dados.nome

    const button = document.createElement("button")
    button.innerText = "ADICIONAR"

    container.appendChild(img)
    container.appendChild(p)
    container.appendChild(button)

    return container
}

function porMaisVendidos(p1, p2) {
    return p2.qtdVendidos - p1.qtdVendidos
}

function porMenosVendidos(p1, p2) {
    return p1.qtdVendidos - p2.qtdVendidos
}

function identity(el) {
    return el
}

function generateProdutos(estrategiaSort, estrategiaFilter) {
    const container = document.getElementById('produtos')
    container.innerHTML = ''

    fetch("../data/produtos.json")
        .then(r => r.json())
        .then(produtos => produtos.filter(estrategiaFilter))
        .then(produtos => produtos.sort(estrategiaSort))
        .then(produtos => {
            for(let produto of produtos) {
                const produtoDOM = createProduto(produto)
                container.appendChild(produtoDOM)
            }
        })
}

function generateProdutosEncontrados() {
    const encontrados = document.getElementById('produtos-encontrados')

    fetch("../data/produtos.json")
        .then(r => r.json())
        .then(produtos => {
            encontrados.innerText = produtos.length  + " PRODUTOS ENCONTRADOS"
        })
}

document.addEventListener("DOMContentLoaded", () => {
    generateFiltros()
    generateProdutos(porMaisVendidos, identity)
    generateProdutosEncontrados()
})

document.getElementById('ordem').addEventListener("change", (event) => {
    if(event.target.value === '1') {
        sortStartegy = porMaisVendidos
    } else {
        sortStartegy = porMenosVendidos
    }

    generateProdutos(sortStartegy, identity)
})
