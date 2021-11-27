import React, { useContext, useEffect } from 'react';
import { Stepper, Step, StepLabel, Divider } from '@mui/material';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Products from '@src/components/cart/Products';
import { useAuthState } from '@src/contexts/auth';
import { CartContext } from '@src/contexts/cart';
import { RuleContext } from '@src/contexts/rule';
import prisma from 'db';

const Confirm = dynamic(() => import('@src/components/cart/Confirm'));
const Waiting = dynamic(() => import('@src/components/cart/Waiting'));

function getSteps() {
  return ['Mengajukan Permohonan', 'Menunggu Validasi RT', 'Konfirmasi Barang Diterima'];
}

const Cart = () => {
  const { skip } = useContext(CartContext);
  const { rules, isSuccess, isError } = useContext(RuleContext);
  const [skipped] = skip;
  const steps = getSteps();
  const router = useRouter();
  const { authenticated } = useAuthState();
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  useEffect(() => {
    if (isError) {
      if (authenticated) {
        throw new Error();
      } else {
        router.push('/login');
      }
    }
  }, [isError]);
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
