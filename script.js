document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ingresoForm");
    const resumenErrores = document.getElementById("resumenErrores");

    // 1. LÓGICA CONDICIONAL DE VISIBILIDAD
    const radiosTipoCliente = document.getElementsByName("tipoCliente");
    const divEmpresa = document.getElementById("divEmpresa");
    radiosTipoCliente.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "Empresa") {
                divEmpresa.classList.remove("hidden");
            } else {
                divEmpresa.classList.add("hidden");
                document.getElementById("nombreEmpresa").value = "";
                document.getElementById("cuit").value = "";
                limpiarClases(document.getElementById("nombreEmpresa"));
                limpiarClases(document.getElementById("cuit"));
            }
        });
    });

    const tipoDispositivo = document.getElementById("tipoDispositivo");
    const divOtroDispositivo = document.getElementById("divOtroDispositivo");
    tipoDispositivo.addEventListener("change", (e) => {
        toggleCampoCondicional(e.target.value === "Otro", divOtroDispositivo, "otroDispositivo");
    });

    const marca = document.getElementById("marca");
    const divOtraMarca = document.getElementById("divOtraMarca");
    marca.addEventListener("change", (e) => {
        toggleCampoCondicional(e.target.value === "Otra", divOtraMarca, "otraMarca");
    });

    const checkGarantia = document.getElementById("checkGarantia");
    const divOrdenGarantia = document.getElementById("divOrdenGarantia");
    checkGarantia.addEventListener("change", (e) => {
        toggleCampoCondicional(e.target.checked, divOrdenGarantia, "ordenGarantia");
    });

    const checkReparacion = document.getElementById("checkReparacion");
    const divReparacionPrevia = document.getElementById("divReparacionPrevia");
    checkReparacion.addEventListener("change", (e) => {
        toggleCampoCondicional(e.target.checked, divReparacionPrevia, "reparacionPrevia");
    });

    const radiosModalidad = document.getElementsByName("modalidadEntrega");
    const divDireccion = document.getElementById("divDireccion");
    radiosModalidad.forEach(radio => {
        radio.addEventListener("change", (e) => {
            toggleCampoCondicional(e.target.value === "Domicilio", divDireccion, "direccion");
        });
    });

    function toggleCampoCondicional(condicion, divElement, inputId) {
        const inputElement = document.getElementById(inputId);
        if (condicion) {
            divElement.classList.remove("hidden");
        } else {
            divElement.classList.add("hidden");
            inputElement.value = "";
            limpiarClases(inputElement);
        }
    }

    function limpiarClases(el) {
        el.classList.remove("campo-error", "campo-ok");
        const errorSpan = el.parentElement.querySelector(".error-msg");
        if(errorSpan) errorSpan.style.display = "none";
    }

    // 2. CONTADORES EN TIEMPO REAL
    configurarContador("descripcion", "contDescripcion", 500);
    configurarContador("reparacionPrevia", "contReparacion", 300);

    function configurarContador(inputId, contadorId, max) {
        const input = document.getElementById(inputId);
        const contador = document.getElementById(contadorId);
        input.addEventListener("input", () => {
            const length = input.value.length;
            contador.textContent = `${length} / ${max}`;
            contador.className = "contador";
            if (length >= max) {
                contador.classList.add("danger");
            } else if (length >= max * 0.8) {
                contador.classList.add("warning");
            }
        });
    }

    // 3. VALIDACIÓN AL ENVIAR (SUBMIT)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let errores = 0;
        let primerError = null;

        // Función auxiliar para marcar campos
        const validarCampo = (condicion, elemento, msgContainer = null) => {
            const container = msgContainer || elemento.parentElement.querySelector(".error-msg");
            if (!condicion) {
                elemento.classList.add("campo-error");
                elemento.classList.remove("campo-ok");
                if (container) container.style.display = "block";
                errores++;
                if (!primerError) primerError = elemento;
            } else {
                elemento.classList.remove("campo-error");
                elemento.classList.add("campo-ok");
                if (container) container.style.display = "none";
            }
        };

        // RegEx
        const regNombre = /^[a-zA-Z\s]{5,80}$/;
        const regDNI = /^\d{7,8}$/;
        const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regTel = /^[\d\s\-\+]{8,}$/;
        const regCUIT = /^(\d{2}-\d{8}-\d{1}|\d{11})$/;

        // Validaciones Sección A
        validarCampo(regNombre.test(form.nombre.value.trim()), form.nombre);
        validarCampo(regDNI.test(form.dni.value.trim()), form.dni);
        validarCampo(regEmail.test(form.email.value.trim()), form.email);
        validarCampo(form.email.value === form.emailConfirm.value && form.emailConfirm.value.trim() !== "", form.emailConfirm);
        validarCampo(regTel.test(form.telefono.value.trim()), form.telefono);

        const isEmpresa = document.querySelector('input[name="tipoCliente"]:checked').value === "Empresa";
        if (isEmpresa) {
            validarCampo(form.nombreEmpresa.value.trim().length > 0, form.nombreEmpresa);
            validarCampo(regCUIT.test(form.cuit.value.trim()), form.cuit);
        }

        validarCampo(form.provincia.value !== "", form.provincia);
        validarCampo(form.localidad.value.trim().length >= 2, form.localidad);

        // Validaciones Sección B
        validarCampo(form.tipoDispositivo.value !== "", form.tipoDispositivo);
        if (form.tipoDispositivo.value === "Otro") {
            validarCampo(form.otroDispositivo.value.trim().length > 0, form.otroDispositivo);
        }
        
        validarCampo(form.marca.value !== "", form.marca);
        if (form.marca.value === "Otra") {
            validarCampo(form.otraMarca.value.trim().length > 0, form.otraMarca);
        }

        validarCampo(form.modelo.value.trim().length >= 2, form.modelo);
        validarCampo(form.so.value !== "", form.so);

        if (checkGarantia.checked) {
            validarCampo(form.ordenGarantia.value.trim().length > 0, form.ordenGarantia);
        }

        // Validaciones Sección C
        validarCampo(form.tipoProblema.value !== "", form.tipoProblema);
        validarCampo(form.desdeCuando.value !== "", form.desdeCuando);
        
        const frecuenciaElegida = document.querySelector('input[name="frecuencia"]:checked');
        const fContainer = document.getElementById("errFrecuencia");
        if (!frecuenciaElegida) {
            fContainer.style.display = "block";
            errores++;
            if (!primerError) primerError = document.getElementsByName("frecuencia")[0];
        } else {
            fContainer.style.display = "none";
        }

        validarCampo(form.descripcion.value.trim().length >= 20, form.descripcion);
        
        if (checkReparacion.checked) {
            validarCampo(form.reparacionPrevia.value.trim().length > 0 && form.reparacionPrevia.value.trim().length <= 300, form.reparacionPrevia);
        }

        // Validaciones Sección D
        const modalidadElegida = document.querySelector('input[name="modalidadEntrega"]:checked');
        const mContainer = document.getElementById("errModalidad");
        if (!modalidadElegida) {
            mContainer.style.display = "block";
            errores++;
            if (!primerError) primerError = document.getElementsByName("modalidadEntrega")[0];
        } else {
            mContainer.style.display = "none";
            if (modalidadElegida.value === "Domicilio") {
                validarCampo(form.direccion.value.trim().length >= 10, form.direccion);
            }
        }

        validarCampo(form.presupuesto.value !== "", form.presupuesto);

        const checksContacto = document.querySelectorAll('input[name="prefContacto"]:checked');
        const errContacto = document.getElementById("errContacto");
        if (checksContacto.length === 0) {
            errContacto.style.display = "block";
            errores++;
            if (!primerError) primerError = document.getElementsByName("prefContacto")[0];
        } else {
            errContacto.style.display = "none";
        }

        validarCampo(form.horario.value !== "", form.horario);
        
        const errDiagnostico = document.getElementById("errDiagnostico");
        if (!document.getElementById("checkDiagnostico").checked) {
            errDiagnostico.style.display = "block";
            errores++;
            if (!primerError) primerError = document.getElementById("checkDiagnostico");
        } else {
            errDiagnostico.style.display = "none";
        }

        const errTerminos = document.getElementById("errTerminos");
        if (!document.getElementById("checkTerminos").checked) {
            errTerminos.style.display = "block";
            errores++;
            if (!primerError) primerError = document.getElementById("checkTerminos");
        } else {
            errTerminos.style.display = "none";
        }

        // 4. MANEJO DE ERRORES O CONFIRMACIÓN
        if (errores > 0) {
            resumenErrores.textContent = `Por favor, corrija los ${errores} errores marcados en el formulario.`;
            resumenErrores.classList.remove("hidden");
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            resumenErrores.classList.add("hidden");
            mostrarConfirmacion();
        }
    });

    function mostrarConfirmacion() {
        document.getElementById("formContainer").classList.add("hidden");
        const pantallaConfirmacion = document.getElementById("pantallaConfirmacion");
        pantallaConfirmacion.classList.remove("hidden");

        const numOrden = "ORD-" + Math.floor(Math.random() * 1000000);
        document.getElementById("confOrden").textContent = numOrden;
        document.getElementById("confNombre").textContent = form.nombre.value;
        
        const tipoDisp = form.tipoDispositivo.value === "Otro" ? form.otroDispositivo.value : form.tipoDispositivo.value;
        const marcadisp = form.marca.value === "Otra" ? form.otraMarca.value : form.marca.value;
        document.getElementById("confEquipo").textContent = `${tipoDisp} - ${marcadisp} (${form.modelo.value})`;
        
        const modalidad = document.querySelector('input[name="modalidadEntrega"]:checked').value === "Local" ? "Entrega en Local" : "Retiro a Domicilio";
        document.getElementById("confModalidad").textContent = modalidad;
        
        pantallaConfirmacion.scrollIntoView({ behavior: 'smooth' });
    }
});
