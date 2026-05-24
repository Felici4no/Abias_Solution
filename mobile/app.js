/* ==========================================================================
   ABIAS MOBILE PROTOTYPE - INTERACTIVE JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Current state values
    let currentAmount = 850;
    let currentFinalidade = "Troca de pneu";
    let currentOficina = "Oficina JN";
    let currentPrazo = "30";
    let userReputacao = 720;
    
    let alineAvalStatus = "pending"; // pending, approved
    let evidenciaStatus = "pending"; // pending, sent, analysis, approved
    let fileUploaded = false;

    // 1. Clock updates
    const clockElement = document.getElementById('mobile-clock');
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        if (clockElement) clockElement.textContent = `${hrs}:${mins}`;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // 2. Navigation Handler
    const screens = document.querySelectorAll('.screen');
    const tabBar = document.getElementById('app-tab-bar');
    const tabs = document.querySelectorAll('.tab-item');
    const sidebarButtons = document.querySelectorAll('.btn-sidebar');

    window.showScreen = function(screenId) {
        // Find target screen element
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (!targetScreen) return;

        // Deactivate all screens
        screens.forEach(s => s.classList.remove('active'));
        targetScreen.classList.add('active');

        // Show/hide bottom tab bar depending on screen
        if (screenId === 'onboarding' || screenId === 'admin') {
            tabBar.style.display = 'none';
        } else {
            tabBar.style.display = 'flex';
        }

        // Update Tab Bar Active State
        tabs.forEach(t => t.classList.remove('active'));
        if (screenId === 'home') {
            document.getElementById('tab-home')?.classList.add('active');
        } else if (screenId === 'solicitar' || screenId === 'plano' || screenId === 'aval' || screenId === 'upload') {
            document.getElementById('tab-solicitar')?.classList.add('active');
        } else if (screenId === 'reputacao') {
            document.getElementById('tab-reputacao')?.classList.add('active');
        } else if (screenId === 'fundo') {
            document.getElementById('tab-fundo')?.classList.add('active');
        } else if (screenId === 'rede') {
            document.getElementById('tab-rede')?.classList.add('active');
        }

        // Sync Desktop Sidebar Buttons Active State
        sidebarButtons.forEach(btn => btn.classList.remove('active'));
        if (screenId === 'onboarding') {
            document.getElementById('btn-show-app')?.classList.add('active');
        } else if (screenId === 'home') {
            document.getElementById('btn-show-home')?.classList.add('active');
        } else if (screenId === 'admin') {
            document.getElementById('btn-show-admin')?.classList.add('active');
        }

        // Scroll screen scroll area to top on switch
        const scrollArea = document.querySelector('.screen-scroll-area');
        if (scrollArea) scrollArea.scrollTop = 0;

        // Custom triggers when switching screens
        if (screenId === 'reputacao') {
            animateReputacaoScore();
        } else if (screenId === 'fundo') {
            animateFundoProgress();
        }
    };

    // 3. Form Solicitar Crédito submission
    window.handleSolicitar = function(event) {
        event.preventDefault();
        
        currentAmount = parseFloat(document.getElementById('form-amount').value);
        currentOficina = document.getElementById('form-oficina').value;
        currentPrazo = document.getElementById('form-prazo').value;
        
        const finalidades = document.getElementsByName('finalidade');
        for (let i = 0; i < finalidades.length; i++) {
            if (finalidades[i].checked) {
                currentFinalidade = finalidades[i].value;
                break;
            }
        }

        // Calculate cycle values (Simple interest margin of 8% shared in Fundo Abias)
        const totalAmount = currentAmount * 1.08;
        const parcelasValor = (totalAmount / 4).toFixed(2);

        // Update Plano suggestions screen
        document.getElementById('plano-finalidade').textContent = currentFinalidade;
        document.getElementById('plano-prazo').textContent = `${currentPrazo} dias`;
        document.getElementById('plano-oficina').textContent = currentOficina;
        document.getElementById('plano-valor').textContent = `R$ ${currentAmount.toFixed(2)}`;
        document.getElementById('plano-parcelas').textContent = `4x de R$ ${new Intl.NumberFormat('pt-BR').format(parcelasValor)}`;

        // Sync Admin Panel queue text
        const adminPendingItem = document.getElementById('admin-pending-item');
        if (adminPendingItem) {
            adminPendingItem.querySelector('.q-amount').textContent = `R$ ${currentAmount.toFixed(2)}`;
            adminPendingItem.querySelector('.q-details').innerHTML = `
                <span>Finalidade: ${currentFinalidade}</span>
                <span>Oficina: ${currentOficina}</span>
            `;
        }

        window.showScreen('plano');
    };

    // 4. Confirm plano sugerido
    window.confirmarPlano = function() {
        window.showScreen('aval');
    };

    // 5. Simular Aval Comunitário Approval Flow
    window.simularAprovacaoComunidade = function() {
        if (alineAvalStatus === 'approved') return;

        const alineCard = document.getElementById('peer-aline-card');
        const alineStatus = document.getElementById('status-aline');
        const btnConvidar = document.getElementById('btn-convidar-validador');
        
        btnConvidar.disabled = true;
        btnConvidar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Solicitando aval...';

        setTimeout(() => {
            alineStatus.className = "status-badge badge-success";
            alineStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Validou';
            btnConvidar.innerHTML = 'Aval comunidade concedido!';
            alineAvalStatus = 'approved';

            // Sync checklist in Admin screen
            const adminChkAline = document.getElementById('admin-chk-aline');
            if (adminChkAline) {
                adminChkAline.className = "chk-status checked";
                adminChkAline.innerHTML = '<i class="fa-solid fa-check"></i> Aval: Aline';
            }

            // Enable Admin approval button
            const btnAdminApprove = document.getElementById('btn-admin-approve');
            if (btnAdminApprove) btnAdminApprove.disabled = false;
        }, 2200);
    };

    // 6. Evidence Upload Simulators
    window.simularSelecaoFoto = function() {
        const uploadDisplay = document.getElementById('file-upload-display');
        const fileName = document.getElementById('file-name-text');
        
        uploadDisplay.style.display = 'flex';
        fileName.textContent = 'foto_peça_nova.jpg';
        fileUploaded = true;
    };

    window.simularUploadRecibo = function() {
        const uploadDisplay = document.getElementById('file-upload-display');
        const fileName = document.getElementById('file-name-text');
        
        uploadDisplay.style.display = 'flex';
        fileName.textContent = 'recibo_oficina_jn.jpg';
        fileUploaded = true;
    };

    window.removerArquivoSimulado = function() {
        const uploadDisplay = document.getElementById('file-upload-display');
        uploadDisplay.style.display = 'none';
        fileUploaded = false;
    };

    // Submit Evidence Action
    window.enviarEvidenciaSimulada = function() {
        if (!fileUploaded) {
            alert('Por favor, tire uma foto ou selecione um recibo primeiro para simular.');
            return;
        }

        const btnSend = document.getElementById('btn-send-evidencia');
        const statusLabel = document.getElementById('evidencia-status-label');
        
        btnSend.disabled = true;
        btnSend.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        setTimeout(() => {
            statusLabel.className = "val-status text-warning";
            statusLabel.textContent = "Em análise pela rede";
            btnSend.innerHTML = 'Evidência em Análise';
            evidenciaStatus = 'analysis';

            // Chain simulated review approval
            setTimeout(() => {
                statusLabel.className = "val-status text-success";
                statusLabel.textContent = "Validado pela oficina";

                setTimeout(() => {
                    statusLabel.textContent = "Evidência aprovada";
                    btnSend.innerHTML = 'Evidência Aprovada!';
                    evidenciaStatus = 'approved';

                    // Boost reputation score
                    userReputacao = 765;
                    // Update Home Screen Display
                    const homeScore = document.querySelector('.reputacao-summary .score-num');
                    if (homeScore) homeScore.textContent = userReputacao;
                }, 2000);
            }, 2500);

        }, 1500);
    };

    // 7. Reputação Score Animation
    function animateReputacaoScore() {
        const scoreVal = document.querySelector('.reputacao-number-row .val');
        if (!scoreVal) return;
        
        let start = 0;
        let end = userReputacao;
        let duration = 800;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            scoreVal.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 8. Fundo progress bar and text animation
    function animateFundoProgress() {
        const barFill = document.querySelector('.fundo-bar-fill-mobile');
        const textVal = document.getElementById('mobile-fundo-val');
        if (!barFill) return;

        barFill.style.width = '0%';
        setTimeout(() => {
            barFill.style.width = '58%';
        }, 100);

        // Animate counter
        if (textVal) {
            let start = 0;
            let end = 4820;
            let duration = 800;
            let startTimestamp = null;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentVal = progress * (end - start) + start;
                textVal.textContent = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(currentVal);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }

    // 9. Admin panel approval actions
    window.adminAprovarCiclo = function() {
        const btnAdminApprove = document.getElementById('btn-admin-approve');
        btnAdminApprove.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executando...';

        setTimeout(() => {
            const adminPendingItem = document.getElementById('admin-pending-item');
            if (adminPendingItem) {
                adminPendingItem.innerHTML = `
                    <div style="text-align: center; padding: 20px 0; color: var(--success); font-weight: bold; animation: fadeIn 0.4s;">
                        <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 8px;"></i>
                        <p>Ciclo de Rota Pré-Aprovado!</p>
                        <p style="font-size: 0.7rem; color: var(--text-secondary); font-weight: normal; margin-top: 4px;">Recurso liberado direto para a Oficina JN.</p>
                    </div>
                `;
            }
            // Trigger return to Home screen state showing cycle active
            setTimeout(() => {
                window.showScreen('home');
                const activeIndicator = document.querySelector('.status-indicator-green');
                if (activeIndicator) {
                    activeIndicator.innerHTML = '<i class="fa-solid fa-circle"></i> Fomento em Manutenção Ativo';
                    activeIndicator.style.color = 'var(--color-gold)';
                }
            }, 1800);
        }, 1500);
    };

    window.adminSolicitarRevisao = function() {
        alert('Solicitação de revisão enviada com sucesso para João Silva via WhatsApp da Rede.');
    };

    // 10. Reset Simulation Demo State
    window.resetDemo = function() {
        currentAmount = 850;
        currentFinalidade = "Troca de pneu";
        currentOficina = "Oficina JN";
        currentPrazo = "30";
        userReputacao = 720;
        alineAvalStatus = "pending";
        evidenciaStatus = "pending";
        fileUploaded = false;

        // Reset UI components
        const btnConvidar = document.getElementById('btn-convidar-validador');
        if (btnConvidar) {
            btnConvidar.disabled = false;
            btnConvidar.textContent = 'Convidar validador (Simular)';
        }

        const alineStatus = document.getElementById('status-aline');
        if (alineStatus) {
            alineStatus.className = "status-badge badge-pending";
            alineStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pendente';
        }

        const adminChkAline = document.getElementById('admin-chk-aline');
        if (adminChkAline) {
            adminChkAline.className = "chk-status warning";
            adminChkAline.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Aval: Aline';
        }

        const btnAdminApprove = document.getElementById('btn-admin-approve');
        if (btnAdminApprove) btnAdminApprove.disabled = true;

        const uploadDisplay = document.getElementById('file-upload-display');
        if (uploadDisplay) uploadDisplay.style.display = 'none';

        const statusLabel = document.getElementById('evidencia-status-label');
        if (statusLabel) {
            statusLabel.className = "val-status text-warning";
            statusLabel.textContent = "Pendente de Envio";
        }

        const btnSend = document.getElementById('btn-send-evidencia');
        if (btnSend) {
            btnSend.disabled = false;
            btnSend.textContent = 'Enviar evidência';
        }

        const homeScore = document.querySelector('.reputacao-summary .score-num');
        if (homeScore) homeScore.textContent = userReputacao;

        const activeIndicator = document.querySelector('.status-indicator-green');
        if (activeIndicator) {
            activeIndicator.innerHTML = '<i class="fa-solid fa-circle"></i> Sua rota está ativa';
            activeIndicator.style.color = 'var(--success)';
        }

        // Rebuild Admin Queue Item if it was approved
        const adminQueueCard = document.querySelector('.admin-queue-card');
        if (adminQueueCard) {
            adminQueueCard.innerHTML = `
                <h4>Fila de Ciclos Pendentes</h4>
                <div class="queue-item" id="admin-pending-item">
                    <div class="q-header">
                        <span class="q-name">João Silva (Leste)</span>
                        <span class="q-amount font-mono">R$ 850,00</span>
                    </div>
                    <div class="q-details">
                        <span>Finalidade: Troca de pneu + Revisão</span>
                        <span>Oficina: Oficina JN</span>
                    </div>
                    <div class="q-checklists">
                        <span class="chk-status checked"><i class="fa-solid fa-check"></i> Rota Comprovada</span>
                        <span class="chk-status checked"><i class="fa-solid fa-check"></i> Aval: Marcos</span>
                        <span class="chk-status warning" id="admin-chk-aline"><i class="fa-solid fa-spinner fa-spin"></i> Aval: Aline</span>
                    </div>
                    <div class="admin-actions-row">
                        <button class="btn-admin btn-admin-approve" id="btn-admin-approve" onclick="window.adminAprovarCiclo()" disabled>Aprovar Fomento</button>
                        <button class="btn-admin btn-admin-reject" onclick="window.adminSolicitarRevisao()">Pedir Revisão</button>
                    </div>
                </div>
            `;
        }

        // Reset form inputs
        document.getElementById('form-amount').value = 850;
        document.getElementById('form-oficina').value = "Oficina JN";
        document.getElementById('form-prazo').value = "30";
        document.getElementById('upload-obs').value = "";
        
        const finalidades = document.getElementsByName('finalidade');
        if (finalidades.length > 0) finalidades[0].checked = true;

        window.showScreen('onboarding');
        alert('A simulação do protótipo foi reiniciada!');
    };

});
