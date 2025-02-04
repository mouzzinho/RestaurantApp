'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Form, Formik, FormikProps } from 'formik';
import Calendar, { CalendarProps } from 'react-calendar';

import BackIcon from '../../../../../../public/back.svg';
import 'react-calendar/dist/Calendar.css';
import styles from './page.module.scss';

import { IUserWorktime } from '@/models/user';
import { useUser } from '@/hooks/use-user';
import { userApi } from '@/redux/api/user';
import { worktimeFormSchema } from '@/forms/worktime.form';

import { toast } from 'react-toastify';
import Input from '@/components/atoms/input';
import Button from '@/components/atoms/button';

interface IDateData {
    day: number | null;
    month: number | null;
    year: number | null;
    date_start?: number;
    date_end?: number;
    start?: string;
    end?: string;
    id?: number | string;
    user_id?: number | string;
}

const Page = () => {
    const params = useSearchParams();
    const id = params.get('id') || '';
    const dispatch = useDispatch();
    const router = useRouter();
    const calendarRef = useRef<CalendarProps>();
    const formRef = useRef<FormikProps<{ date_start: string; date_end: string }>>(null);
    const [selectedDate, setSelectedDate] = useState<IDateData>();
    const [yearAndMonth, setYearAndMonth] = useState(getYearAndMonth());
    const [isFormEnabled, setIsFormEnabled] = useState(false);
    const [areRibbonsHidden, setAreaRibbonsHidden] = useState(false);
    const userState = useUser('worktime', yearAndMonth, id);
    const worktimes = getWorktime(userState.worktime.data);
    const isLoading =
        userState.createWorktime.isLoading || userState.updateWorktime.isLoading || userState.worktime.isLoading || userState.worktime.isFetching;

    const handleDayChange = (date: Date, event: React.MouseEvent<HTMLButtonElement>) => {
        [...document.querySelectorAll('.react-calendar__tile')].forEach((button) => button.classList.remove('selected'));
        const button = event.target as HTMLButtonElement;
        button.classList.add('selected');

        const dateParts = getDateParts(date);
        const worktime = worktimes.find((worktime) => worktime.day === dateParts.day);
        setSelectedDate({ ...worktime, ...dateParts });
        setIsFormEnabled(false);

        if (worktime) {
            formRef.current?.setFieldValue('date_start', worktime.start, false);
            formRef.current?.setFieldValue('date_end', worktime.end, false);
        } else {
            formRef.current?.setFieldValue('date_start', '', false);
            formRef.current?.setFieldValue('date_end', '', false);
        }
    };

    const handleMonthChange = (date: Date | null) => {
        if (date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            setYearAndMonth({ year: year, month: month });
            setAreaRibbonsHidden(true);
            dispatch(userApi.util.invalidateTags(['Worktime']));
        }
    };

    const toggleForm = () => setIsFormEnabled(!isFormEnabled);

    const submitForm = (values: { date_start: string; date_end: string }) => {
        if (selectedDate) {
            const date_start = new Date(`${selectedDate.year}.${selectedDate.month}.${selectedDate.day} ${values.date_start}`).getTime();
            const date_end = new Date(`${selectedDate.year}.${selectedDate.month}.${selectedDate.day} ${values.date_end}`).getTime();

            if (selectedDate && selectedDate.id && selectedDate.user_id) {
                userState.updateWorktime
                    .fetch({
                        id: selectedDate.id,
                        user_id: selectedDate.user_id,
                        date_start: date_start,
                        date_end: date_end,
                    })
                    .catch(() => {
                        toast('Wystąpił błąd podczas zapisywania czasu pracy', { type: 'error' });
                    });
            } else {
                console.log('create');
                userState.createWorktime
                    .fetch({
                        user_id: id,
                        date_start: date_start,
                        date_end: date_end,
                    })
                    .catch(() => {
                        toast('Wystąpił błąd podczas zapisywania czasu pracy', { type: 'error' });
                    });
            }
        }

        toggleForm();
    };

    useEffect(() => {
        if (calendarRef.current) {
            setSelectedDate(getDateParts(calendarRef.current.activeStartDate));
        }
    }, []);

    useEffect(() => {
        if (!userState.worktime.isFetching) {
            setAreaRibbonsHidden(false);
        }
    }, [userState.worktime.isFetching]);

    useEffect(() => {
        if (id && id.toString() !== userState.data.id.toString() && userState.data.role === 'USER') {
            router.replace('/dashboard');
        }
    }, [userState]);

    if (id && id.toString() !== userState.data.id.toString() && userState.data.role === 'USER') return null;

    return (
        <div className={`${styles.container} ${isLoading ? styles.loading : ''}`}>
            {userState.data.role !== 'ADMIN'}
            <Link href={userState.data.role === 'USER' ? '/dashboard' : `/users/${id}`} className={styles.link}>
                <BackIcon className={styles.icon} /> Wróć do profilu
            </Link>
            <div className={`${styles.calendarContainer} ${areRibbonsHidden ? styles.loading : ''}`}>
                <Calendar
                    defaultActiveStartDate={new Date()}
                    ref={calendarRef}
                    className={styles.calendar}
                    value={null}
                    onClickDay={(value, event) => handleDayChange(value, event)}
                    onActiveStartDateChange={({ activeStartDate }) => {
                        handleMonthChange(activeStartDate);
                    }}
                    tileContent={(args) => {
                        const activeDate = new Date(args.activeStartDate);
                        const date = new Date(args.date);
                        const isActive = activeDate.getMonth() === date.getMonth();
                        const day = date.getDate();
                        const worktime = worktimes.find((item) => item.day === day);

                        return (
                            <p className={`${styles.ribbon} ${!isActive || !worktime ? styles.inactive : ''}`}>
                                {isActive && worktime ? `${worktime.start}-${worktime.end}` : ''}
                            </p>
                        );
                    }}
                />
            </div>
            <Formik
                innerRef={formRef}
                initialValues={{ date_start: '', date_end: '' }}
                onSubmit={(values) => submitForm(values)}
                validationSchema={worktimeFormSchema}
            >
                {() => {
                    return (
                        <Form>
                            <p className={styles.label}>Twój grafik na dzień: {getBeautifiedDate(selectedDate)}</p>
                            <div className={styles.inputs}>
                                <Input
                                    isDisabled={!isFormEnabled}
                                    name={'date_start'}
                                    label={'Godzina rozpoczęcia'}
                                    placeholder={'Wypełnij...'}
                                    type={'time'}
                                />
                                <Input
                                    isDisabled={!isFormEnabled}
                                    name={'date_end'}
                                    label={'Godzina zakończenia'}
                                    placeholder={'Wypełnij...'}
                                    type={'time'}
                                />
                            </div>
                            <Button className={`${styles.submit} ${!isFormEnabled ? styles.hidden : ''}`} type={'submit'}>
                                Zapisz
                            </Button>
                            <Button className={`${styles.edit} ${isFormEnabled ? styles.hidden : ''}`} type={'button'} onClick={toggleForm}>
                                Edytuj
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

function getWorktime(data?: IUserWorktime[]) {
    if (data) {
        return data.map((worktime) => {
            const dateStart = new Date(worktime.date_start);
            const dateEnd = new Date(worktime.date_end);

            const day = dateStart.getDate();
            const startHours = dateStart.getHours() < 10 ? '0' + dateStart.getHours() : dateStart.getHours();
            const startMinutes = dateStart.getMinutes() < 10 ? '0' + dateStart.getMinutes() : dateStart.getMinutes();
            const endHours = dateEnd.getHours() < 10 ? '0' + dateEnd.getHours() : dateEnd.getHours();
            const endMinutes = dateEnd.getMinutes() < 10 ? '0' + dateEnd.getMinutes() : dateEnd.getMinutes();

            return {
                id: worktime.id,
                user_id: worktime.user_id,
                day: day,
                start: `${startHours}:${startMinutes}`,
                end: `${endHours}:${endMinutes}`,
                date_start: worktime.date_start,
                date_end: worktime.date_end,
            };
        });
    }

    return [];
}

function getYearAndMonth() {
    const date = new Date();

    return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function getBeautifiedDate(date: IDateData | undefined) {
    if (date) {
        const day = date.day && date.day < 10 ? `0${date.day}` : date.day;
        const month = date.month && date.month < 10 ? `0${date.month}` : date.month;

        return `${day}.${month}.${date.year}`;
    }

    return '';
}

function getDateParts(date: Date | undefined) {
    if (date) {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    return { year: null, month: null, day: null };
}

export default Page;
