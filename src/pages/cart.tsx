import React, { useContext } from 'react';
import { Stepper, Step, StepLabel, Divider } from '@mui/material';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import Confirm from '@src/components/cart/Confirm';
import Products from '@src/components/cart/Products';
import Waiting from '@src/components/cart/Waiting';
import { CartContext } from '@src/contexts/cart';

function getSteps() {
  return ['Mengajukan Permohonan', 'Menunggu Validasi RT', 'Konfirmasi Barang Diterima'];
}

const getRules = async () => {
  const { data } = await axios.get('/api/rules');
  return data;
};

const Cart = () => {
  const { skip } = useContext(CartContext);
  const [skipped] = skip;
  const steps = getSteps();
  const { data: rules, isSuccess } = useQuery('rules', getRules);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  function getStepContent(step) {
    switch (step) {
      case 1:
        return <Products rules={rules} isSuccess={isSuccess} />;
      case 2:
        return <Waiting />;
      case 3:
        return <Confirm rules={rules} />;
      default:
        return 'Unknown step';
    }
  }

  return (
    <>
      <Head>
        <title>Inventory | Cart</title>
      </Head>
      {isSuccess && (
        <div style={{ width: '100%' }}>
          <Stepper activeStep={rules?.activeStep - 1} style={{ backgroundColor: 'inherit' }}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Divider style={{ margin: '1rem 0' }} />
          <div style={{ marginTop: '6rem', marginBottom: '6rem' }}>
            <div>{getStepContent(rules?.activeStep)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const prisma = new PrismaClient();
  try {
    const { cookie } = req.headers;
    if (!cookie) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const { authorization } = req.cookies;
    const { userId }: any = verify(authorization, process.env.JWT_SECRET);
    await prisma.user.findUnique({ where: { id: userId } });
    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
