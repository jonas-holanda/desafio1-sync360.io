const state = {
    modal: new bootstrap.Modal(document.querySelector('#editar')),
    form: document.querySelector('#form-editar'),
    cardSection: {
        nomeUser: document.querySelector('#nome-user'),
        idadeUser: document.querySelector('#idade-user'),
        cepUser: document.querySelector('#cep-user'),
        ruaUser: document.querySelector('#rua-user'),
        bairroUser: document.querySelector('#bairro-user'),
        cidadeUser: document.querySelector('#cidade-user'),
        estadoUser: document.querySelector('#estado-user'),
        imagemUser: document.querySelector('#imagem-user'),
        numCasaUser: document.querySelector('#num_casa-user'),
        bioUser: document.querySelector('#bio-user')
    },
    formValues: {
        nomeUser: document.querySelector('input[name="nome_user-form"]'),
        idadeUser: document.querySelector('input[name="idade_user-form"]'),
        cepUser: document.querySelector('input[name="cep_user-form"]'),
        ruaUser: document.querySelector('input[name="rua_user-form"]'),
        bairroUser: document.querySelector('input[name="bairro_user-form"]'),
        cidadeUser: document.querySelector('input[name="cidade_user-form"]'),
        estadoUser: document.querySelector('input[name="estado_user-form"]'),
        imagemUser: document.querySelector('input[name="imagem_user-form"]'),
        numCasaUser: document.querySelector('input[name="num_user-form"]'),
        bioUser: document.querySelector('textarea[name="bio_user-form"]')
    }
}

state.form.addEventListener('submit', (event) => {
    event.preventDefault();
    let qtdIguais = 0;

    for (const i in state.cardSection) {
        let valorCard = i == "imagemUser" ? state.cardSection[i].src : state.cardSection[i].innerText;
        let valorForm = state.formValues[i];

        if (valorCard === valorForm.value) qtdIguais++;
    }
    
    if (qtdIguais === 10) {
        state.modal.hide();
        Swal.fire({
            title: "Sem Alterações!",
            text: "Não houve alteração nos dados!",
            icon: "info"
          });

    } else {

        let camposVazios = false;
        for (const i in state.formValues) {
            const valorForm = state.formValues[i];
            const nomeCampo = valorForm.placeholder;
            const divPai = valorForm.parentElement;
            
            const alerta = divPai.nextElementSibling;
            
            if (valorForm.value === "") {
                if (alerta) {
                    alerta.remove();
                }    

                divPai.insertAdjacentHTML("afterend", `<div class="text-danger mb-3">Campo ${nomeCampo} é obrigatório!</div>`);
             
                camposVazios = true;
            }
        }
       
        if (!camposVazios) {

            for (const i in state.formValues) {
                let valorForm = state.formValues[i];
                i == "imagemUser" ? state.cardSection[i].src = valorForm.value : state.cardSection[i].innerText = valorForm.value; 
            }

            state.modal.hide();

            Swal.fire({
                title: "Sucesso!",
                text: "Dados alterados com sucesso!",
                icon: "success"
            });
        }
    }

});

document.querySelector('#chamaModal').addEventListener('click', () => {
    for (const i in state.formValues) {
        let valorForm = state.formValues[i];
        i == "imagemUser" ? valorForm.value = state.cardSection[i].src : valorForm.value = state.cardSection[i].innerText;  
        
        const divPai = valorForm.parentElement;
        const alerta = divPai.nextElementSibling;
        if (alerta) {
            alerta.remove();
        } 
        
    }
});

state.formValues.cepUser.addEventListener('keyup', (event) => {
    fetchCep(event.target.value);
})

const fetchCep = async (cep) => {

    let cepValidado = cep.replace(/[^0-9]/g,'');

    if (cepValidado.length === 8) {
        const url = `https://viacep.com.br/ws/${cepValidado}/json/`;

        const response = await fetch(url);
        
        if (response.status === 200) {

                const data = await response.json();
                if (!(data.erro == true)) {
                    state.formValues.ruaUser.value = data.logradouro;
                    state.formValues.bairroUser.value = data.bairro;
                    state.formValues.cidadeUser.value = data.localidade;
                    state.formValues.estadoUser.value = data.uf;
                    state.formValues.cepUser.value = data.cep;
                }

        }
    } else {
        return;
    }

}