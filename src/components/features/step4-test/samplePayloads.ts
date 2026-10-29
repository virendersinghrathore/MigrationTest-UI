export const PASS_SAMPLE = JSON.stringify(
  {
    _id: 'cust_99281',
    profile: {
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'eleanor.vance@enterprise.io'
    },
    account: {
      creditLimit: 15000,
      isActive: true
    }
  },
  null,
  2
);

export const FAIL_SAMPLE = JSON.stringify(
  {
    _id: 'cust_99281',
    profile: {
      firstName: 'Eleanor',
      lastName: '',
      email: 'not-an-email-address'
    },
    account: {
      creditLimit: 'INVALID_NUMBER_STRING',
      isActive: 'true_as_string'
    },
    unexpectedExtraField: 'deprecated_token_3910'
  },
  null,
  2
);
