/**
 * Garante que o objeto jsPDF (da biblioteca jsPDF) esteja disponível
 * no escopo global (que é como ele é carregado ao usar a tag <script>).
 */
const { jsPDF } = window.jspdf;

/**
 * --- FUNÇÃO NOVA ---
 * Adiciona o cabeçalho (logo) a uma página.
 * Esta função é chamada para a primeira página e para cada nova página.
 */
function addHeader(doc) {
    const logoImg = document.getElementById('logo');

    if (!logoImg) {
        console.warn("Elemento <img> com id='logo' não encontrado. O logo não será adicionado.");
        return;
    }

    // --- Configurações do Logo (AJUSTE O TAMANHO AQUI) ---
    const logoWidth = 10;  // Largura do logo em mm (ex: 10mm)
    const logoHeight = 10.5; // Altura do logo em mm (ex: 10.5mm)
    const y_top = 10;      // Margem do topo (ex: 10mm)
    // --- Fim das Configurações ---

    const pageWidth = doc.internal.pageSize.getWidth();
    const x_center = (pageWidth / 2) - (logoWidth / 2); // Calcula o X para centralizar

    try {
        // Adiciona a imagem
        doc.addImage(logoImg, 'PNG', x_center, y_top, logoWidth, logoHeight);
    } catch (e) {
        console.error("Erro ao adicionar o logo. Verifique se o 'logo.png' foi carregado corretamente.", e);
        // Adiciona um texto de fallback se a imagem falhar
        doc.setFontSize(8).text("Erro no Logo", pageWidth / 2, 15, { align: 'center' });
    }
}


/**
 * Função principal para gerar o PDF.
 * Ela será chamada pelo 'onclick' do seu botão no HTML.
 */
function gerarPDF() {

    // --- 1. OBTER VALORES DO HTML ---
    // (Sem alterações aqui)
    const nome = document.getElementById('nome').value || " ";
    const rg = document.getElementById('rg').value || "_______";
    const cpf = document.getElementById('cpf').value || "_______";
    const endereco = document.getElementById('endereco').value || "_______";
    const orgao = document.getElementById('orgao').value || "_______";
    const usou_margem_sim = document.getElementById('usou_margem_sim').checked;
    const valor_margem = document.getElementById('valor_margem').value || "_______";
    const banco_quitar = document.getElementById('banco_quitar').value || "_______";
    const valor_parcelas_quitar = document.getElementById('valor_parcelas_quitar').value || "_______";
    const valor_parcelas_unificadas = document.getElementById('valor_parcelas_unificadas').value || "_______";
    const prazo = document.getElementById('prazo').value || "_______";
    const valor_liquido = document.getElementById('valor_liquido').value || "_______";
    const valor_total_repasse = document.getElementById('valor_total_repasse').value || "_______";
    const testemunha_nome = document.getElementById('testemunha_nome').value || "_______";
    const local_data = document.getElementById('local_data').value || "Brasília/DF, ___ de _________ de _____";


    // --- 2. CONFIGURAÇÃO DO DOCUMENTO ---
    const doc = new jsPDF('p', 'mm', 'a4'); // Retrato, milímetros, A4

    // --- ALTERAÇÃO AQUI ---
    // O 'y' inicial agora é 35mm para dar espaço ao logo (que fica em y=10, com 15mm de altura + margem)
    let y = 35; // Posição Y (cursor), começando abaixo do logo
    // --- Fim da Alteração ---

    const x = 15;                          // Margem esquerda fixa de 15mm
    const x_indent = 25;                   // Margem para itens de cláusula (indentados)
    const maxWidth = 180;                  // Largura máxima do texto
    const lineHeight = 6;                  // Altura da linha
    const pageHeight = 297;                // Altura da página A4
    const bottomMargin = 20;               // Margem inferior

    // --- 3. FUNÇÕES AUXILIARES (HELPERS) ---

    /**
     * Verifica se o cursor 'y' ultrapassou o limite da página.
     * Se sim, adiciona uma nova página e reseta o 'y'.
     */
    function checkPageBreak() {
        if (y >= pageHeight - bottomMargin) {
            doc.addPage();

            // --- ALTERAÇÃO AQUI ---
            addHeader(doc); // Adiciona o logo na nova página
            y = 35; // Reseta o 'y' para a margem (abaixo do logo)
            // --- Fim da Alteração ---
        }
    }

    /**
     * Adiciona um parágrafo de texto com quebra de linha automática.
     * (Sem alterações nesta função)
     */
    function addParagraph(text, isBold = false, indent = false) {
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const current_x = indent ? x_indent : x;
        const current_maxWidth = indent ? maxWidth - (x_indent - x) : maxWidth;
        const lines = doc.splitTextToSize(text, current_maxWidth);
        doc.text(lines, current_x, y);
        y += lines.length * lineHeight;
        checkPageBreak();
    }

    /**
     * Adiciona uma única linha de texto.
     * (Sem alterações nesta função)
     */
    function addLine(text, isBold = false, align = 'left', indent = false) {
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const current_x = indent ? x_indent : x;
        let x_pos = current_x;
        if (align === 'center') {
            x_pos = doc.internal.pageSize.getWidth() / 2;
        } else if (align === 'right') {
            x_pos = doc.internal.pageSize.getWidth() - x;
        }
        doc.text(text, x_pos, y, { align: align });
        y += lineHeight;
        checkPageBreak();
    }

    /**
     * Pula um número de linhas.
     * (Sem alterações nesta função)
     */
    function skipLines(count = 1) {
        y += lineHeight * count;
        checkPageBreak();
    }

    // --- 4. CONSTRUÇÃO DO PDF (Baseado no seu documento) ---

    // --- ALTERAÇÃO AQUI ---
    addHeader(doc); // Adiciona o logo na PRIMEIRA página
    // --- Fim da Alteração ---

    // Título
    doc.setFontSize(12);
    addLine('TERMO DE CIÊNCIA, DE RESPONSABILIDADE E CONFISSÃO DE DÍVIDA', true, 'center'); //
    skipLines(3);

    // Parágrafo de Identificação
    doc.setFontSize(10);
    const p1_text = `Eu, ${nome}, portador da cédula de identidade R.G. nº ${rg}, brasileiro, inscrito no CPF nº ${cpf}, residente e domiciliado na ${endereco}, vinculado ao órgão ${orgao}, DECLARO, para os devidos fins, que autorizo a empresa ALIANÇA CONSIG, inscrita no CNPJ sob o nº 50.113.116/0001-05, com sede na CSE 06, Lote 30, Sala 204 – Taguatinga Sul – CEP: 72025-065 – Brasília/DF, a realizar a quitação dos contratos consignados em meu contracheque, conforme descrito abaixo:A realizar a quitação do(s) contrato(s) de minha responsabilidade que estão consignados em meu holerite de pagamento conforme descrição abaixo:`;
    addParagraph(p1_text);
    skipLines(2);

    // CLÁUSULA PRIMEIRA
    addLine('CLÁUSULA PRIMEIRA – DA OPERAÇÃO', true); //
    skipLines(1);
    const margem_sim = usou_margem_sim ? '(X) Sim' : '( ) Sim';
    const margem_nao = !usou_margem_sim ? '(X) Não' : '( ) Não';
    addLine(`1.1. Houve utilização de margem consignável? ${margem_sim}  ${margem_nao}`, false, 'left', true); //
    if (usou_margem_sim) {
        addLine(`Se sim, qual o valor? R$ ${valor_margem}`, false, 'left', true); //
    } else {
        addLine(`Se sim, qual o valor? R$ _______`, false, 'left', true); //
    }
    addLine(`Banco a ser quitado: ${banco_quitar}`, false, 'left', true); //
    addLine(`Parcelas: R$ ${valor_parcelas_quitar}`, false, 'left', true); //
    addLine(`Valor final das parcelas unificadas: R$ ${valor_parcelas_unificadas}`, false, 'left', true); //
    addLine(`Prazo: ${prazo}`, false, 'left', true); //
    skipLines(2);

    // CLÁUSULA SEGUNDA
    addLine('CLÁUSULA SEGUNDA – DO PAGAMENTO', true); //
    skipLines(1);
    addLine(`2.1. Valor líquido a ser recebido pelo cliente: R$ ${valor_liquido}, acrescido do estorno da parcela.`, false, 'left', true); //
    addLine(`2.2. Valor total a ser repassado à empresa, referente à quitação do saldo devedor, comissão, impostos, seguro e juros: R$ ${valor_total_repasse}.`, false, 'left', true); //
    skipLines(1);
    addParagraph('Parágrafo Único: Autorizo, desde já, que a empresa ALIANÇA CONSIG atue como minha representante para digitação e pagamento das parcelas mencionadas, relativas à compra de dívida perante os bancos citados, com a transferência para o banco Bradesco S.A, observando que os valores podem variar de acordo com os juros e coeficientes do dia, mediante aprovação da operação.'); //
    skipLines(2);

    // CLÁUSULA TERCEIRA
    addLine('CLÁUSULA TERCEIRA – DA ABERTURA DE CONTAS', true); //
    skipLines(1);
    addParagraph('3.1 . Caixa Econômica Federal: A abertura de conta será realizada para fins de averbação da margem consignável, conforme liberação das parcelas pelos bancos. Esta conta será utilizada também para TED dos valores, garantindo segurança para a empresa intermediadora e para o cliente. O cliente deverá, ainda, assinar e reconhecer firma do documento da TED, que será emitido com os valores das transferências.', false, true); //
    skipLines(1);
    addParagraph('3.2. Bradesco S.A: A abertura de conta será exigida para aprovação e pagamento do contrato. O banco solicita a abertura para que todos os aceites sejam realizados via aplicativo.', false, true); //
    skipLines(1);
    addParagraph('Parágrafo Único: Tenho ciência de que o banco pode levar de 7 (sete) a 10 (dez) dias para liberar a margem para averbação da proposta. Passado esse prazo, será feita cobrança ao banco. Autorizo o uso da minha senha do SOU GOV e do e-mail, exclusivamente para fins de consulta da margem consignável e eventuais autorizações, com a minha ciência.'); //
    skipLines(1);
    addParagraph('Ciente das informações acima e do disposto no parágrafo único, no qual preciso fornecer a senha do SOU GOV e email, assino abaixo:'); //
    skipLines(3);
    addLine('ASSINATURA DO DEVEDOR: _________________________________________', false, 'left', true); //
    skipLines(2);

    // CLÁUSULA QUARTA
    addLine('CLÁUSULA QUARTA – DAS CONDIÇÕES DA OPERAÇÃO', true); //
    skipLines(1);
    addParagraph('4.1. Declaro estar ciente de que, uma vez assinada esta transação, será realizada a quitação dos contratos indicados, não sendo possível o cancelamento ou desistência da operação junto à nova instituição financeira até sua completa finalização.', false, true); //
    skipLines(2);

    // CLÁUSULA QUINTA
    addLine('CLÁUSULA QUINTA – DAS TESTEMUNHAS', true); //
    skipLines(1);
    addParagraph('5.1. Para contratos de clientes com idade superior a 60 (sessenta) anos, conforme a Lei nº 14.423, de 22 de julho de 2022, será exigida a assinatura de uma testemunha de primeiro grau com vínculo familiar com o cliente.', false, true); //
    skipLines(1);
    addParagraph('5.2. Na ausência de parente próximo ou caso o cliente opte por não contar com testemunha, será necessário o envio de um vídeo, no qual o cliente declare plena ciência do contrato e manifeste sua decisão de não ter testemunha. Esse vídeo deverá ser anexado à documentação da operação para fins de formalização.', false, true); //
    skipLines(1);
    addParagraph('Parágrafo Único: Comprometo-me a não utilizar a margem consignável correspondente ao contrato quitado em outra consignatária, devendo a mesma permanecer disponível até a conclusão da operação e contratação do novo contrato, intermediado pela Aliança Consig de Seguros Ltda., na instituição financeira que oferecer a melhor condição disponível no dia ou conforme indicação da empresa, respeitando meu perfil de crédito. Essa conduta visa manter a boa-fé na negociação, conforme a legislação vigente.');
    skipLines(2);

    // CLÁUSULA SEXTA
    addLine('CLÁUSULA SEXTA – DA RESPONSABILIDADE CIVIL E PENAL', true); //
    skipLines(1);
    addParagraph('6.1. Declaro ter pleno conhecimento do conteúdo deste instrumento. Em caso de uso indevido da margem liberada junto a outra instituição financeira, estarei sujeito à responsabilização por eventual crime, que poderá ser comunicado às autoridades competentes.', false, true); //
    skipLines(4);

    // --- 5. ASSINATURAS E RODAPÉ ---
    // (Sem alterações aqui)

    // Data
    addLine(local_data, false, 'left'); //
    skipLines(5);

    // Assinatura do Credor
    addLine('_________________________________________', false, 'center'); //
    addLine('Alianca Consig. Alianca Solucoes em Negocios LTDA', false, 'center'); //
    addLine('ASSINATURA DO CREDOR', false, 'center');
    skipLines(3);

    // Assinatura do Devedor
    addLine('_________________________________________', false, 'center'); //
    addLine(nome, false, 'center');
    addLine('ASSINATURA DO DEVEDOR', false, 'center');
    skipLines(3);

    // Assinatura da Testemunha
    addLine('_________________________________________', false, 'center');
    addLine(`TESTEMUNHA: ${testemunha_nome}`, false, 'center'); //
    addLine('(Grau de Parentesco): ________________', false, 'center'); //
    skipLines(5);

    // --- 6. SALVAR O ARQUIVO ---
    doc.save(`Confissao_Divida_${nome.replace(/ /g, '_')}.pdf`);
}