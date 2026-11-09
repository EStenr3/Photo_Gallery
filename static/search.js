document.addEventListener('DOMContentLoaded', function() {

    /* Make sure instructions always show on category selection */
    let select = document.getElementById('category_select');
    select.value = "default";

    /* Show/hide later later form elements when category is changed */
    select.addEventListener('change', function() {

        let filters = document.getElementById('filters');
        let features = document.getElementById('features');
        let color = document.getElementById('color');

        /* If user selected landscapes */
        if (select.value == 'landscape') {
            /* Show features div if not already visible */
            if (window.getComputedStyle(features).display == 'none') {
                features.classList.remove('d-none');
            }
            /* Hide filters div if not already hidden */
            if (window.getComputedStyle(filters).display != 'none') {
                filters.classList.add('d-none');
            }
        }

        /* If user selected flowers, birds, or animals */
        if (select.value == 'flower' || select.value == 'bird' || select.value == 'animal') {
            /* Show filters div if not already visible */
            if (window.getComputedStyle(filters).display == 'none') {
                filters.classList.remove('d-none');
            }
            /* Hide features div if not already hidden */
            if (window.getComputedStyle(features).display != 'none') {
                features.classList.add('d-none');
            }
        }

        /* If user selected birds or animals */
        if (select.value == 'bird' || select.value == 'animal') {
            /* Hide color input if not already hidden */
            if (window.getComputedStyle(color).display != 'none') {
                color.classList.add('d-none');
            }
        }

        /* If user selected flowers */
        if (select.value == 'flower') {
            /* Show color input if not already visible */
            if (window.getComputedStyle(color).display == 'none') {
                color.classList.remove('d-none');
            }
        }

        /* If user opted not to select a category */
        if (select.value == 'default') {
            /* Hide features div if not already hidden */
            if (window.getComputedStyle(features).display != 'none') {
                features.classList.add('d-none');
            }
            /* Hide filters div if not already hidden */
            if (window.getComputedStyle(filters).display != 'none') {
                filters.classList.add('d-none');
            }
        }

        /* Reset styles on type and color labels to light theme */
        /* Type label */
        if (type_label.classList.contains('bg-dark')) {
            type_label.classList.replace('bg-dark', 'bg-light');
        }
        if (type_label.classList.contains('text-white')) {
            type_label.classList.replace('text-white', 'text-body');
        }
        if (type_label.classList.contains('border-dark')) {
            type_label.classList.remove('border-dark');
        }

        /* Color label */
        if (color_label.classList.contains('bg-dark')) {
            color_label.classList.replace('bg-dark', 'bg-light');
        }
        if (color_label.classList.contains('text-white')) {
            color_label.classList.replace('text-white', 'text-body');
        }
        if (color_label.classList.contains('border-dark')) {
            color_label.classList.remove('border-dark');
        }

    });

    /* Make type and color fields mutually exclusive */
    let type_input = document.getElementById('type_inp');
    let color_input = document.getElementById('color_inp');
    let type_label = document.getElementById('type_lbl');
    let color_label = document.getElementById('color_lbl');

    /* When user clicks in type input field */
    type_input.addEventListener('focus', function() {

        /* Change type label to dark theme */
        if (type_label.classList.contains('bg-light')) {
            type_label.classList.replace('bg-light', 'bg-dark');
        }
        if (type_label.classList.contains('text-body')) {
            type_label.classList.replace('text-body', 'text-white');
        }
        if (! type_label.classList.contains('border-dark')) {
            type_label.classList.add('border-dark');
        }

        /* Change color label to light theme */
        if (color_label.classList.contains('bg-dark')) {
            color_label.classList.replace('bg-dark', 'bg-light');
        }
        if (color_label.classList.contains('text-white')) {
            color_label.classList.replace('text-white', 'text-body');
        }
        if (color_label.classList.contains('border-dark')) {
            color_label.classList.remove('border-dark');
        }

        /* Clear color input field */
        color_input.value = '';

    });

    /* When user clicks in color input field */
    color_input.addEventListener('focus', function() {

        /* Change color label to dark theme */
        if (color_label.classList.contains('bg-light')) {
            color_label.classList.replace('bg-light', 'bg-dark');
        }
        if (color_label.classList.contains('text-body')) {
            color_label.classList.replace('text-body', 'text-white');
        }
        if (! color_label.classList.contains('border-dark')) {
            color_label.classList.add('border-dark');
        }

        /* Change type label to light theme */
        if (type_label.classList.contains('bg-dark')) {
            type_label.classList.replace('bg-dark', 'bg-light');
        }
        if (type_label.classList.contains('text-white')) {
            type_label.classList.replace('text-white', 'text-body');
        }
        if (type_label.classList.contains('border-dark')) {
            type_label.classList.remove('border-dark');
        }

        /* Clear type input field */
        type_input.value = '';

    });

});
