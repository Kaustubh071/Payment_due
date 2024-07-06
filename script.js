
        $(document).ready(function () {
            var emailId = getQueryVariable('email');

            // Show loader
            $('#loading').show();

            if (emailId) {
                $.getJSON("https://script.google.com/macros/s/AKfycbwtkHFL844GxbWV2YLDGnFCo8gHmilkmOnQ8XeY4U2eCde4lXpGRZVRWON9aQbzvVQW/exec?emailId=" + encodeURIComponent(emailId), function (data) {
                    if (data.error) {
                        $('#dashboard').html('<p>' + data.error + '</p>');
                    } else {
                        var dashboardContent = `
                            <div class="header">
                                <h1>Asterisc Group</h1>
                            </div>
                            <div class="title"><h2>Student Dashboard</h2></div>
                            <div class="content">
                                <div class="card">
                                    <div class="field"><span><b>Name:</b></span><br> ${data.studentName}</div>
                                    <div class="field"><span><b>Course:</b></span><br> ${data.course}</div>
                                    <div class="field"><span><b>Mobile:</b></span><br> ${data.mobile}</div>
                                </div>
                                <div class="card">
                                    <div class="field"><span><b>Admission Date:</b></span><br> ${formatDate(data.admissionDate)}</div>
                                    <div class="field"><span><b>Admission Fees:</b></span> <br>${data.admissionFees}</div>
                                    <div class="field"><span><b>Branch:</b></span> <br>${data.branch}</div>
                                </div>
                                <div class="card">
                                    <div class="field"><span><b>Remaining Fees:</b></span><br> ${data.remainingFees}</div>
                                    <div class="field"><span><b>Monthly Fees:</b></span><br> ${data.monthlyFees}</div>
                                    <div class="field"><span><b>Installment:</b></span><br> ${data.installment}</div>
                                </div>
                            </div>
                            <div style="overflow-x:auto;">
                                <table class="monthly-data">
                                    <thead>
                                        <tr>
                                            <th>Sr No</th>
                                            <th>Month</th>
                                            <th>Payment Date</th>
                                            <th>Amount</th>
                                            <th>Mode</th>
                                            <th>Remark</th>
                                            <th>Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                        `;

                        var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
                        var currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
                        var sr = 0;

                        months.forEach(function (month, index) {
                            var monthData = data.months[month];
                            var receipt = '-';
                            var remark = '-';

                            if (monthData && monthData.amount) {
                                if (index < currentMonth) {
                                    if (monthData.mode === 'Online' || monthData.mode === 'Cash') {
                                        remark = 'Paid &#10004;';
                                        receipt = '<a class="payment-link" href="#">View Receipt</a>';
                                    } else {
                                        remark = 'Late';
                                    }
                                } else if (index === currentMonth) {

                                    if (monthData.mode === 'Online' || monthData.mode === 'Cash') {
                                        remark = 'Paid &#10004;';
                                        receipt = '<a class="payment-link" href="#">View Receipt</a>';
                                    }
                                    else

                                    remark = '<a class="payment-link" href="#">Make Payment</a>';
                                }

                                dashboardContent += `
                                    <tr>
                                        <td>${sr + 1}</td>
                                        <td>${month.charAt(0).toUpperCase() + month.slice(1)}</td>
                                        <td>${monthData.date ? formatDate(monthData.date) : '-'}</td>
                                        <td>${monthData.amount}</td>
                                        <td>${monthData.mode || '-'}</td>
                                        <td>${remark}</td>
                                        <td>${receipt}</td>
                                    </tr>
                                `;
                                sr++;
                            }
                        });

                        dashboardContent += `
                                    </tbody>
                                </table>
                            </div>
                        `;

                        $('#dashboard').html(dashboardContent);

                         // Show the container after data is loaded
                         $('.container').fadeIn();
                    }

                    // Hide loader after data is loaded
                    $('#loading').hide();
                });
            } else {
                $('#dashboard').html('<p>No email ID provided.</p>');
                $('#loading').hide();
            }
        });

        function getQueryVariable(variable) {
            var query = window.location.search.substring(1); // Excludes the '?' character
            var vars = query.split('&');

            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) === variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query parameter %s not found', variable);
            return null;
        }

        function formatDate(dateString) {
            var date = new Date(dateString);
            var day = ("0" + date.getDate()).slice(-2);
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var year = date.getFullYear();
            return day + "-" + month + "-" + year;
        }