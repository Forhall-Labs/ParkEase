export const translations = {
  es: {
    app: {
      title: 'ParkEase',
      subtitle: 'Panel de gestión',
    },
    nav: {
      dashboard: 'Dashboard',
      users: 'Usuarios',
      vehicles: 'Vehículos',
      parameters: 'Parámetros',
      settings: 'Configuración',
    },
    login: {
      welcome: 'Bienvenido a ParkEase',
      login: 'Iniciar sesión',
      enterCredentials: 'Ingresa tus credenciales para continuar.',
      username: 'Usuario',
      password: 'Contraseña',
      enter: 'Entrar',
      loggingIn: 'Entrando...',
      google: 'Google',
    },
    dashboard: {
      live: 'Dashboard en vivo',
      title: 'Operación del parqueo, resumida en una sola vista.',
      description:
        'Sigue la ocupación, los ingresos y la actividad del día desde un panel más claro.',
      lastUpdate: 'Última actualización',
      parkedVehicles: 'Vehículos Parqueados',
      todayRevenue: 'Ingresos de Hoy',
      todayVehicles: 'Vehículos Atendidos',
      currentStatus: 'Estado actual',
      colonesAccumulated: 'Colones acumulados',
      closedExits: 'Salidas cerradas',
      quickSummary: 'Resumen rápido',
      indicators: 'Indicadores del momento',
    },
    vehicles: {
      title: 'Vehículos en Parqueo',
      addVehicle: 'Ingresar Vehículo',
      addVehicleTitle: 'Ingresar Vehículo',
      searchFilter: 'Filtro de búsqueda',
      plate: 'Placa',
      plateLabel: 'Placa',
      owner: 'Propietario',
      ownerLabel: 'Propietario',
      reference: 'Referencia',
      ingressTime: 'Hora de Ingreso',
      exitTime: 'Hora de Salida',
      actions: 'Acciones',
      checkout: 'Dar Salida',
      confirmCheckout: 'Confirmar Salida',
      totalToPay: 'Total a Pagar',
      delete: 'Eliminar',
      noVehicles: 'No hay vehículos en parqueo.',
      registering: 'Registrando...',
      register: 'Registrar',
    },
    validation: {
      plateRequired: 'La placa es requerida',
      plateFormat: 'Formato inválido. Use: ABC-123, MOT-123456 o CL-123456',
    },
    vehicleForm: {
      title: 'Ingresar Vehículo',
      plate: 'Placa *',
      platePlaceholder: 'ABC-123',
      reference: 'Referencia',
      owner: 'Propietario',
      ownerPlaceholder: 'Nombre del propietario',
      rate: 'Tarifa',
      cancel: 'Cancelar',
      register: 'Registrar',
      registering: 'Registrando...',
    },
    checkout: {
      title: 'Confirmar Salida',
      ingressDate: 'Hora de Ingreso',
      egressDate: 'Hora de Salida',
      total: 'Total a Pagar',
      cancel: 'Cancelar',
      confirm: 'Confirmar Salida',
    },
    users: {
      title: 'Gestión de Usuarios',
      addUser: 'Nuevo Usuario',
      name: 'Nombre',
      lastname: 'Apellido',
      username: 'Usuario',
      email: 'Email',
      status: 'Estado',
      active: 'Activo',
      inactive: 'Inactivo',
      actions: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      noUsers: 'No hay usuarios.',
    },
    userForm: {
      newTitle: 'Nuevo Usuario',
      editTitle: 'Editar Usuario',
      name: 'Nombre',
      lastname: 'Apellido',
      username: 'Usuario',
      password: 'Contraseña',
      passwordHint: '(dejar vacío para mantener)',
      email: 'Email',
      cancel: 'Cancelar',
      save: 'Guardar',
      create: 'Crear',
    },
    parameters: {
      title: 'Gestión de Parámetros',
      addParam: 'Nuevo Parámetro',
      quantity: 'Cantidad (por hora)',
      tax: 'Tarifa',
      version: 'Versión',
      actions: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      noParams: 'No hay parámetros configurados.',
      hourlyRate: 'Tarifa por hora',
      firstHour: 'Primera hora',
    },
    paramForm: {
      newTitle: 'Nuevo Parámetro',
      editTitle: 'Editar Parámetro',
      quantity: 'Cantidad (por hora)',
      tax: 'Tarifa',
      hourlyRate: 'Tarifa por hora (CRC)',
      firstHour: 'Primera hora (CRC)',
      cancel: 'Cancelar',
      save: 'Guardar',
    },
    settings: {
      description: 'Administra las preferencias del sistema',
      theme: {
        label: 'Tema',
        light: 'Claro',
        dark: 'Oscuro',
      },
      language: {
        label: 'Idioma',
        es: 'Español',
        en: 'English',
      },
      parking: {
        title: 'Información del Parqueo',
        name: 'Nombre del parqueo',
        address: 'Dirección',
        phone: 'Teléfono',
        email: 'Email',
      },
      rates: {
        title: 'Tarifas',
        ratePerHour: 'Tarifa por hora',
        type: 'Tipo',
        save: 'Guardar',
        noRates: 'No hay tarifas configuradas.',
      },
      save: 'Guardar',
    },
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      confirm: 'Confirmar',
      yes: 'Sí',
      no: 'No',
      error: 'Error',
      success: 'Éxito',
      logout: 'Cerrar Sesión',
      create: 'Crear',
    },
  },
  en: {
    app: {
      title: 'ParkEase',
      subtitle: 'Management Panel',
    },
    nav: {
      dashboard: 'Dashboard',
      users: 'Users',
      vehicles: 'Vehicles',
      parameters: 'Parameters',
      settings: 'Settings',
    },
    login: {
      welcome: 'Welcome to ParkEase',
      login: 'Login',
      enterCredentials: 'Enter your credentials to continue.',
      username: 'Username',
      password: 'Password',
      enter: 'Enter',
      loggingIn: 'Logging in...',
      google: 'Google',
    },
    dashboard: {
      live: 'Live Dashboard',
      title: 'Parking operation summarized in one view.',
      description: 'Follow occupancy, revenue, and daily activity from a clearer panel.',
      lastUpdate: 'Last update',
      parkedVehicles: 'Parked Vehicles',
      todayRevenue: "Today's Revenue",
      todayVehicles: 'Vehicles Served',
      currentStatus: 'Current status',
      colonesAccumulated: 'Colones accumulated',
      closedExits: 'Closed exits',
      quickSummary: 'Quick Summary',
      indicators: 'Current Indicators',
    },
    vehicles: {
      title: 'Vehicles in Parking',
      addVehicle: 'Add Vehicle',
      addVehicleTitle: 'Add Vehicle',
      searchFilter: 'Search filter',
      plate: 'Plate',
      plateLabel: 'Plate',
      owner: 'Owner',
      ownerLabel: 'Owner',
      reference: 'Reference',
      ingressTime: 'Ingress Time',
      exitTime: 'Egress Time',
      actions: 'Actions',
      checkout: 'Checkout',
      confirmCheckout: 'Confirm Checkout',
      totalToPay: 'Total to Pay',
      delete: 'Delete',
      noVehicles: 'No vehicles in parking.',
      registering: 'Registering...',
      register: 'Register',
    },
    validation: {
      plateRequired: 'Plate is required',
      plateFormat: 'Invalid format. Use: ABC-123, MOT-123456 or CL-123456',
    },
    vehicleForm: {
      title: 'Add Vehicle',
      plate: 'Plate *',
      platePlaceholder: 'ABC-123',
      reference: 'Reference',
      owner: 'Owner',
      ownerPlaceholder: "Owner's name",
      rate: 'Rate',
      cancel: 'Cancel',
      register: 'Register',
      registering: 'Registering...',
    },
    checkout: {
      title: 'Confirm Checkout',
      ingressDate: 'Ingress Time',
      egressDate: 'Egress Time',
      total: 'Total to Pay',
      cancel: 'Cancel',
      confirm: 'Confirm Checkout',
    },
    users: {
      title: 'User Management',
      addUser: 'New User',
      name: 'Name',
      lastname: 'Lastname',
      username: 'Username',
      email: 'Email',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      noUsers: 'No users.',
    },
    userForm: {
      newTitle: 'New User',
      editTitle: 'Edit User',
      name: 'Name',
      lastname: 'Lastname',
      username: 'Username',
      password: 'Password',
      passwordHint: '(leave empty to keep)',
      email: 'Email',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create',
    },
    parameters: {
      title: 'Parameter Management',
      addParam: 'New Parameter',
      quantity: 'Quantity (per hour)',
      tax: 'Tax',
      version: 'Version',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      noParams: 'No parameters configured.',
      hourlyRate: 'Hourly rate',
      firstHour: 'First hour',
    },
    paramForm: {
      newTitle: 'New Parameter',
      editTitle: 'Edit Parameter',
      quantity: 'Quantity (per hour)',
      tax: 'Tax',
      hourlyRate: 'Hourly rate (CRC)',
      firstHour: 'First hour (CRC)',
      cancel: 'Cancel',
      save: 'Save',
    },
    settings: {
      title: 'Settings',
      description: 'Manage system preferences',
      tabs: {
        general: 'General',
        parking: 'Parking',
        rates: 'Rates',
      },
      theme: {
        label: 'Theme',
        light: 'Light',
        dark: 'Dark',
      },
      language: {
        label: 'Language',
        es: 'Español',
        en: 'English',
      },
      parking: {
        title: 'Parking Information',
        name: 'Parking name',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
      },
      rates: {
        title: 'Rates',
        ratePerHour: 'Rate per hour',
        type: 'Type',
        save: 'Save',
        noRates: 'No rates configured.',
      },
      save: 'Save',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      error: 'Error',
      success: 'Success',
      logout: 'Logout',
      create: 'Create',
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;

let currentLanguage: Language = 'es';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('app-language', lang);
}

export function getLanguage(): Language {
  const saved = localStorage.getItem('app-language');
  if (saved === 'es' || saved === 'en') {
    currentLanguage = saved;
  }
  return currentLanguage;
}

export function t(path: string): string {
  const keys = path.split('.');
  let value: unknown = translations[currentLanguage];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}

export function initI18n(): void {
  const saved = localStorage.getItem('app-language');
  if (saved === 'es' || saved === 'en') {
    currentLanguage = saved;
  }
}
